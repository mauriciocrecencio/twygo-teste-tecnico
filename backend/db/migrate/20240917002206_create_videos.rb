class CreateVideos < ActiveRecord::Migration[6.1]
  def change
    create_table :videos do |t|
      t.string :title, null: false
      t.integer :content_id, null: false
      t.string :url, null: false
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
    add_index :videos, :content_id, unique: true
    add_index :videos, :url, unique: true
  end
end