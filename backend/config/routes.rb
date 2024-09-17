Rails.application.routes.draw do
  match '(:anything)' => 'application#nothing', via: [:options]
  resources :courses, only: [:index, :show, :create, :update, :destroy]
end