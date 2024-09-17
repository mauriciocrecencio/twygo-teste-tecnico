class Course < ApplicationRecord
  has_many :videos, dependent: :destroy
  
  validates :name, presence: true
  validates :description, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  
  scope :current, -> { where('end_date >= ?', Date.current) }
  
  def total_video_size
    videos.sum(:file_size)
  end
end