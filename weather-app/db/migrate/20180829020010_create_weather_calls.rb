class CreateWeatherCalls < ActiveRecord::Migration[5.2]
  def change
    create_table :weather_calls do |t|
      t.integer :zip
      t.string :response

      t.timestamps
    end
  end
end
