# testTgBot
Для запуск бота понадобится:  
    -- установить все зависимости - npm i  
    -- Настроить .env файл (см  env exapmle):  
            - PORT для выбора порта на котором будет запускаться сервер  
            - DATABASE_URL для настройки БД (postgresUser - ваш пользователь postgres, postgresUserPass - пароль пользователя,       databaseName - название БД произвольное)  
            - TELEGRAM_TOKEN токен который выдает @BotFather при создании бота для доступа к HTTP API  
            - WEATHER_API_KEY ключ для работы с https://openweathermap.org/api  
    -- Создать БД - npx sequelize db:create  
    -- Создать миграции - npx sequelize db:migrate  
    -- Скрипт запуска npm start; Скрипт запуска для разработки npm run dev (подключается nodemon и morgan)  
