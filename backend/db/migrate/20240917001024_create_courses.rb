class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses do |t|
      t.string :name
      t.text :description
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
