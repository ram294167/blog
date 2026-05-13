export default async function sitemap() {
  return [
    { url: `${process.env.BASE_URL}` },
    { url: `${process.env.BASE_URL}/create` },
    { url: `${process.env.BASE_URL}/login` },
    { url: `${process.env.BASE_URL}/signup` },
    { url: `${process.env.BASE_URL}/time` },
  ]
}
