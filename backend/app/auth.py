from authx import AuthX, AuthXConfig

config = AuthXConfig()
config.JWT_SECRET_KEY = 'viperrr'
config.JWT_TOKEN_LOCATION = ['headers']

security = AuthX(config=config)