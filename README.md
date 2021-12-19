> Для запуска `npm run start`
> Проект откроется в окне браузера по умолчанию

### Примечания
* Сборщик вебпак. Я не стал сильно заморачиваться с TypeScript или особыми настройками вроде inline js, так как это тестовое задание
* Добавлен индикатор загрузки с процентами, для слабого интернета
* Изображения оптимизированы без потери качества
* Каждая картинка загружается через лоадер через файл assetsList
* Добавлена поддержка ES5
* Применена маска для обрезания выступающих объектов
* Для клика используется поинтер, клики мыши и тачскрина засчитываются одинаково
* Анимации на каждом из элементов с помощью GSAP 3. Хотел добавить анимации появления каждой декорации в комнате, но не стал) Но это можно сделать буквально одной строчкой кода
* Постарался расположить все предметы пиксельно ровно так как в верстке.
* Защита от мультиклика по опциям
* Масштабируемость путем добавления новых лестниц (хотя тут это не нужно), спокойная замена компонентов (без привязки к названиям).

* После финального экрана отключается возможность кликать по кнопкам кроме кнопки продолжить. Даже если каким-то образом скрыть всплывающее окно.

## Скалирование
Я быстро накидал 2 варианта скалирования, но оба мне не нравятся. Я бы расположил каждый предмет индивидуально относительно изначальной позиции и скалировал, относительно новых размеров экрана. 
Но это довольно много работы и опционально, (хотя результат должен быть крутой) так что я оставил эту затею. И я не уверен что это верное направление мысли)