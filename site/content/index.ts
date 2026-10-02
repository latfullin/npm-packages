// Пакеты на сайте. Новый пакет: папка content/<имя>/ с meta.ts и страницами, и строка здесь
import tinyval from './tinyval/meta';
import type { PackageMeta } from './types';

export const packages: PackageMeta[] = [tinyval];
