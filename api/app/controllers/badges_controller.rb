class BadgesController < ApplicationController

  def create
    @teacher = Teacher.find(params[:teacher_id])
    @badge = @teacher.badges.build( phrase: params[:phrase],teacher_id: params[:teacher_id], votes: params[:votes])

    if @badge.save
      render json: @badge
    else
      render json: @badge.errors.full_message
    end
  end
end
