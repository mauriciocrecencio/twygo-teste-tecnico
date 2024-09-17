class CoursesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_course, only: [:show, :destroy]
  
  def index
    @courses = Course.all
    render json: @courses, include: :videos
  end

  def show
    render json: @course, include: :videos
  end

  def new
    @course = Course.new
  end

  def create
    @course = Course.new(course_params)

    if @course.save
      upload_result = upload_videos
      if upload_result == :success
        render json: { message: 'Curso criado com sucesso', course: @course }, status: :created
      else
        @course.destroy # Rollback if video upload failed
        render json: { error: 'Falha ao fazer upload dos vídeos' }, status: :unprocessable_entity
      end
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @course.update(course_params)
      upload_videos if params[:videos].present?
      render json: { message: 'Curso atualizado com sucesso', course: @course }, status: :ok
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    Rails.logger.debug "Iniciando exclusão do curso: #{params[:id]}"

    if @course.nil?
      Rails.logger.debug "Curso não encontrado: #{params[:id]}"
      render json: { error: 'Curso não encontrado' }, status: :not_found
    elsif @course.destroy
      Rails.logger.debug "Curso excluído com sucesso"
      render json: { message: 'Curso excluído com sucesso.' }, status: :ok
    else
      Rails.logger.debug "Erro ao excluir curso: #{@course.errors.full_messages}"
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_course
    @course = Course.find_by(id: params[:id])
    Rails.logger.debug "Curso encontrado: #{@course.inspect}"
  end

  def course_params
    params.permit(:name, :description, :start_date, :end_date)
  end

  def upload_videos
    Rails.logger.debug "Iniciando upload de vídeos"
    # return :success unless params[:videos].is_a?(Hash)
    
    success = true
    params[:videos].each do |_, video_param|
      Rails.logger.debug "Processando vídeo: #{video_param.inspect}"
      
      unless video_param[:title].present?
        Rails.logger.debug "Título do vídeo ausente"
        success = false
        break
      end
  
      video = @course.videos.new(
        title: video_param[:title],
        content_id: SecureRandom.uuid # Gerar um UUID único para cada vídeo
      )
  
      if video_param[:video_file].present?
        Rails.logger.debug "Arquivo de vídeo presente, iniciando upload para S3"
        s3_service = ::S3UploadService.new
        file_key = "videos/#{SecureRandom.uuid}_#{video_param[:video_file].original_filename}"
        video.url = s3_service.upload(video_param[:video_file], file_key)
        Rails.logger.debug "Upload concluído, URL: #{video.url}"
      else
        Rails.logger.debug "Nenhum arquivo de vídeo presente"
        success = false
        break
      end
  
      if video.save
        Rails.logger.debug "Vídeo salvo com sucesso: #{video.inspect}"
      else
        Rails.logger.debug "Erro ao salvar vídeo: #{video.errors.full_messages}"
        success = false
        break
      end
    end
  
    Rails.logger.debug "Upload de vídeos concluído. Sucesso: #{success}"
    success ? :success : :failure
  end
end