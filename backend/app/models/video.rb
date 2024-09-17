class Video < ApplicationRecord
  belongs_to :course

  validates :title, presence: true
  validates :content_id, presence: true, uniqueness: true
  validates :url, presence: true
  
  attr_accessor :video_file
end