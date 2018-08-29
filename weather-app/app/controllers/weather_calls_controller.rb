class WeatherCallsController < ApplicationController

	def json_response(object, status = :ok)
		render json: object, status: status
	end

	def index
		@weather_call = WeatherCall.find_by(zip: params[:zip])
		json_response(@weather_call)
	end


end