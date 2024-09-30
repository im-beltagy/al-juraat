'use client';

import { Avatar, TextField } from '@mui/material';
import { Box, Stack, Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { RHFUploadAvatar } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { Article } from 'src/types/articles';

interface Props {
  article: Article;
}
export default function SingleArticleView({ article }: Props) {
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
      <CustomBreadcrumbs heading={t('Article ')} links={[{}]} sx={{ mb: 3 }} />

      <Stack spacing={3} maxWidth="20rem">
        <Box sx={{ mb: 5 }}>
          <Avatar
            src={article.imageUrl}
            sx={(theme) => ({
              width: 150,
              height: 150,
              mx: 'auto',
              border: '.5rem solid white',
              outline: `1px dashed ${theme.palette.divider}`,
            })}
          />
        </Box>

        <TextField
          name="Title"
          label={t('Title')}
          placeholder={t('Title')}
          value={article.title}
          inputProps={{ readOnly: true }}
        />

        <TextField
          rows={5}
          name="Content"
          label={t('Content')}
          multiline
          placeholder={t('Content')}
          value={article.content}
          inputProps={{ readOnly: true }}
        />
      </Stack>
    </Container>
  );
}
