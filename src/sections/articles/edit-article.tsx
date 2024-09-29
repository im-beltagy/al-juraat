'use client';

import { Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { Article } from 'src/types/articles';

import NewEditArticleForm from './new-edit-article-form';

interface Props {
  article: Article;
}

export default function EditArticleView({ article }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Edit Article')} links={[{}]} sx={{ mb: 3 }} />

      <NewEditArticleForm article={article} />
    </Container>
  );
}
