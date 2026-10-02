// Пакеты на сайте. Новый пакет: папка content/<имя>/ с meta.ts и страницами, и строка здесь
import tinyval from './tinyval/meta';
import tinyvalVue from './tinyval-vue/meta';
import tinyvalMask from './tinyval-mask/meta';
import type { PackageMeta } from './types';

export const packages: PackageMeta[] = [tinyval, tinyvalVue, tinyvalMask];
