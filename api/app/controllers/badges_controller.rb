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

  def update
    @teacher = Teacher.find(params[:teacher_id])
    @badge = Badge.find(params[:id])
    if params[:vote_type] == 'up'
      @badge.votes += 1
      @badge.save
      render json: @badge
    elsif params[:vote_type] == 'down'
      @badge.votes -= 1
      @badge.save
      render json: @badge
    else
      render json: { success: false}
    end

  end
end
