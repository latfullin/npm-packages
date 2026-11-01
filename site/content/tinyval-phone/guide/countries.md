::: ru
## Откуда форматы

Таблица стран генерируется из метаданных [libphonenumber](https://github.com/google/libphonenumber) — библиотеки Google, по которой номера проверяет Android. Для каждой страны берётся пример мобильного номера и его национальный формат без приставки: так номер пишут в самой стране.

28 стран из `tinyval-mask` сохраняют его форматы — `+7 (999) 999-99-99`, а не `+7 999 999-99-99`: при переходе с `tinyval-mask` на `tinyval-phone` ничего не меняется.

В бандл библиотека Google не попадает: в пакете только готовая таблица — код страны, шаблон и пара регулярных выражений.
:::

::: en
## Where formats come from

The country table is generated from the metadata of [libphonenumber](https://github.com/google/libphonenumber) — the Google library Android uses to check numbers. For each country we take an example mobile number and its national format without the prefix: that's how the number is written in the country itself.

The 28 countries of `tinyval-mask` keep its formats — `+7 (999) 999-99-99`, not `+7 999 999-99-99`: switching from `tinyval-mask` to `tinyval-phone` changes nothing.

The Google library doesn't get into the bundle: the package contains only the ready table — the dial code, the pattern and a couple of regular expressions.
:::

::: zh
## 格式从哪里来

国家表由 [libphonenumber](https://github.com/google/libphonenumber) 的元数据生成 —— 这是 Android 用来校验号码的 Google 库。对每个国家，取一个手机号码示例及其不带前缀的国内格式：也就是该国本地书写号码的方式。

`tinyval-mask` 中的 28 个国家保留其原有格式 —— `+7 (999) 999-99-99`，而不是 `+7 999 999-99-99`：从 `tinyval-mask` 切换到 `tinyval-phone` 不会有任何变化。

Google 库不会进入打包文件：包中只有现成的表 —— 区号、模板和几个正则表达式。
:::

```ts
import { phoneTable } from 'tinyval-phone';

phoneTable.jp; // ['81', '99-9999-9999', '0']
phoneTable.bs; // ['1', '(999) 999-9999', '1', '242']
//               код, шаблон после кода, национальная приставка, признак страны
```

::: ru
## Номера разной длины

В некоторых странах номера бывают разной длины: в Германии мобильный — 10 или 11 цифр, в Австрии — от 8 до 13. Лишние цифры в шаблоне необязательные: `+49 999 9999999[9]`. Номер считается заполненным (`complete`), когда введена минимальная длина, — дальше можно дописать ещё цифры.
:::

::: en
## Numbers of different length

In some countries numbers vary in length: a German mobile number has 10 or 11 digits, an Austrian one — 8 to 13. The extra digits are optional in the pattern: `+49 999 9999999[9]`. The number is filled (`complete`) once the minimal length is typed — more digits can be added after that.
:::

::: zh
## 长度不同的号码

在一些国家，号码长度不固定：德国手机号为 10 或 11 位，奥地利为 8 到 13 位。模板中多出的数字是可选的：`+49 999 9999999[9]`。输入达到最小长度时，号码即视为已填写（`complete`）—— 之后还可以继续输入数字。
:::

::: ru
## Страны с общим кодом

Один телефонный код бывает у нескольких стран: `+1` — США, Канада и ещё 23 страны и территории (Багамы, Ямайка, Пуэрто-Рико…), `+7` — Россия и Казахстан, `+44` — Великобритания, Джерси, Гернси и остров Мэн. Страна определяется так:

1. Берётся самый длинный подходящий код: `+1242…` — код `1`, `+375…` — код `375`.
2. Если у страны есть «признак» и номер под него подходит — это она. Признак — начало номера (`+1 242` — Багамы) или весь номер (`+1 416 555 0123` — Канада: по коду города, когда номер введён полностью).
3. Иначе — главная страна кода: `+1` — США, `+44` — Великобритания.

Пока номер Канады введён не полностью, показываются США — маска у них одинаковая, меняется только флаг. Номера Аландских островов, Ватикана, Шпицбергена, Кокосовых островов и ещё нескольких территорий не отличить от номеров Финляндии, Италии, Норвегии и Австралии — для них определяется главная страна, так же делает и libphonenumber.
:::

::: en
## Countries sharing a code

Several countries can share one dial code: `+1` is the USA, Canada and 23 more countries and territories (the Bahamas, Jamaica, Puerto Rico…), `+7` is Russia and Kazakhstan, `+44` is the UK, Jersey, Guernsey and the Isle of Man. The country is detected like this:

1. The longest matching code is taken: `+1242…` — code `1`, `+375…` — code `375`.
2. If a country has a "sign" and the number matches it — that's the country. The sign is the beginning of the number (`+1 242` — the Bahamas) or the whole number (`+1 416 555 0123` — Canada: by the area code, once the number is typed in full).
3. Otherwise — the main country of the code: `+1` is the USA, `+44` is the UK.

Until a Canadian number is typed in full, the USA is shown — the mask is the same, only the flag changes. Numbers of the Åland Islands, Vatican City, Svalbard, the Cocos Islands and a few more territories can't be told apart from numbers of Finland, Italy, Norway and Australia — the main country is detected for them, just like libphonenumber does.
:::

::: zh
## 共用区号的国家

一个电话区号可能属于多个国家：`+1` 是美国、加拿大以及另外 23 个国家和地区（巴哈马、牙买加、波多黎各……），`+7` 是俄罗斯和哈萨克斯坦，`+44` 是英国、泽西岛、根西岛和马恩岛。国家按以下方式识别：

1. 取最长的匹配区号：`+1242…` —— 区号 `1`，`+375…` —— 区号 `375`。
2. 如果某个国家有“特征”且号码与之匹配 —— 就是这个国家。特征可以是号码开头（`+1 242` —— 巴哈马），也可以是整个号码（`+1 416 555 0123` —— 加拿大：在号码输入完整后按地区代码识别）。
3. 否则 —— 该区号的主要国家：`+1` 是美国，`+44` 是英国。

在加拿大号码输入完整之前显示的是美国 —— 掩码相同，只是国旗不同。奥兰群岛、梵蒂冈、斯瓦尔巴、科科斯群岛等少数地区的号码无法与芬兰、意大利、挪威和澳大利亚的号码区分 —— 对它们识别为主要国家，libphonenumber 也是这样处理的。
:::

```ts
detectCountry('+1 201 555 0123'); // 'us'
detectCountry('+1 242 359 1234'); // 'bs'
detectCountry('+1 416 555 0123'); // 'ca'
detectCountry('+7 701 123 4567'); // 'kz'
detectCountry('+44 7797 712345'); // 'je'
```

::: ru
## Национальная приставка

Внутри страны перед номером часто набирают приставку: `8` в России, `0` в Британии и Германии, `06` в Венгрии. С `defaultCountry` её можно вводить — она отбрасывается, а код страны добавляется сам:
:::

::: en
## National prefix

Inside a country a prefix is often dialed before the number: `8` in Russia, `0` in the UK and Germany, `06` in Hungary. With `defaultCountry` it can be typed — it's dropped and the country code is added automatically:
:::

::: zh
## 国内长途前缀

在国内拨号时，号码前常常要加前缀：俄罗斯是 `8`，英国和德国是 `0`，匈牙利是 `06`。设置 `defaultCountry` 后可以输入它 —— 前缀会被去掉，国家代码会自动加上：
:::

```ts
mask('07400123456', phoneAuto({ defaultCountry: 'gb' })); // '+44 7400 123456'
mask('015123456789', phone('de'));                       // '+49 151 23456789'
mask('0612345678', phone('fr'));                         // '+33 6 12 34 56 78'
```

::: ru
## Свои страны и форматы

Формат страны можно поменять, страну — добавить или убрать: `npx tinyval-phone countries` копирует таблицу в проект, а `setCountries` подключает её. Подробно — [Свои страны и флаги](~/guide/custom).
:::

::: en
## Your own countries and formats

You can change a country's format, add or remove a country: `npx tinyval-phone countries` copies the table into your project and `setCountries` loads it. Details — [Your own countries & flags](~/guide/custom).
:::

::: zh
## 自定义国家和格式

可以修改国家的格式，添加或删除国家：`npx tinyval-phone countries` 把国家表复制到项目中，`setCountries` 加载它。详见 [自定义国家和国旗](~/guide/custom)。
:::

```ts
import { setCountries } from 'tinyval-phone';

setCountries({ de: ['49', '9999 9999999[9]', '0'], xk: null });
```

::: ru
## Обновление данных

Номерные планы стран иногда меняются. В самом пакете таблица и флаги пересобираются из свежих `libphonenumber-js` и `country-flag-icons` командой `npm run generate -w packages/tinyval-phone`; тесты проверяют пример номера каждой страны.
:::

::: en
## Updating the data

Countries' numbering plans change from time to time. In the package itself the table and the flags are rebuilt from fresh `libphonenumber-js` and `country-flag-icons` with `npm run generate -w packages/tinyval-phone`; tests check an example number of every country.
:::

::: zh
## 更新数据

各国的号码规划有时会变化。可以通过 `npm run generate -w packages/tinyval-phone` 从最新的 `libphonenumber-js` 和 `country-flag-icons` 重新生成国家表和国旗；测试会检查每个国家的示例号码。
:::
