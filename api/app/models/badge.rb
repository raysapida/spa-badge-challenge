class Badge < ActiveRecord::Base
  validates :phrase, presence: true
  validates :votes, presence:true, numericality: true
  validates :teacher_id, presence: true, numericality: true
  belongs_to :teacher
end
