import { NextApiRequest, NextApiResponse } from 'next';
import { getStaticProps } from '../projects/[id]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { project } = req.query;
  const { props } = await getStaticProps({ params: { id: project as string } });
  res.json(props);
};
