class CreateBadges < ActiveRecord::Migration
  def change
    create_table :badges do |t|
      t.string :phrase
      t.integer :votes
      t.integer :teacher_id

      t.timestamps null: false
    end
  end
end
