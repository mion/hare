require 'sinatra'

set :public_folder, '.'

get '/' do
  redirect '/index.html'
end

get '/recompile' do
  puts "[*] Re-compiling..."
  value = %x{ sh compile }
  "Result: #{value}"
end
