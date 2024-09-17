require 'aws-sdk-s3'

class S3UploadService
  def initialize
    @s3_client = Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
    @bucket_name = ENV['AWS_S3_BUCKET']
    Rails.logger.debug "S3UploadService inicializado com bucket: #{@bucket_name}"
  end

  def upload(file, key)
    begin
      Rails.logger.debug "Iniciando upload para S3: #{key}"
      @s3_client.put_object(
        bucket: @bucket_name,
        key: key,
        body: file,
        acl: 'public-read'
      )
      Rails.logger.debug "Arquivo enviado com sucesso para S3: #{key}"
      "https://#{@bucket_name}.s3.amazonaws.com/#{key}"
    rescue Aws::S3::Errors::ServiceError => e
      Rails.logger.error "Erro ao fazer upload para S3: #{e.message}"
      nil
    end
  end
end