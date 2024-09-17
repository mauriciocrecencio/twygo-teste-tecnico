class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token
  protect_from_forgery with: :null_session

  def nothing
    render text: '', content_type: 'text/plain'
  end

end
