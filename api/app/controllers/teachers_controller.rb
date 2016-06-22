class TeachersController < ApplicationController

  def index
      render json: Teacher.all
  end

  def show
    teacher = Teacher.find(params[:id])
    teacher_hash = teacher.serializable_hash
    badge = teacher.badges
    badge_hash = badge.to_a.map(&:serializable_hash)
    result =  teacher_hash.merge(badges: badge_hash)
    render json: result
  end

end
