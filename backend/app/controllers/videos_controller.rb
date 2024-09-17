class VideosController < ApplicationController
  before_action :set_course

  def create
    @video = @course.videos.new(video_params)

    if @video.video_file.present?
      s3_service = S3UploadService.new
      file_key = "videos/#{SecureRandom.uuid}_#{@video.video_file.original_filename}"
      @video.url = s3_service.upload(@video.video_file.tempfile, file_key)
    end

    if @video.save
      render json: { message: 'Vídeo criado com sucesso', video: @video }, status: :created
    else
      render json: { errors: @video.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_course
    @course = Course.find_by(id: params[:course_id])
    
    unless @course
      render json: { error: 'Curso não encontrado' }, status: :not_found
    end
  end

  def video_params
    params.require(:video).permit(:title, :content_id, :video_file)
  end
end