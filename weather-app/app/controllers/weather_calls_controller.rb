class WeatherCallsController < ApplicationController

	def json_response(object, status = :ok)
		render json: object, status: status
	end

	def index
		@weather_call = WeatherCall.find_by(zip: params[:zip])
		json_response(@weather_call)
	end

	# POST /weather_calls
	def create
		@weather_call = WeatherCall.create(weather_call_params)
	end

	# PATCH /weather_calls/:id
	def update
		@weather_call = WeatherCall.find(params[:id])
		@weather_call.update(weather_call_params)
	end


	private

		def weather_call_params

			params.permit(:zip, :response)

		end


end