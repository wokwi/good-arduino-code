import { NextApiRequest, NextApiResponse } from 'next';
import { getStaticProps } from '../projects/[id]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { project } = req.query;
  const result = await getStaticProps({ params: { id: project as string } });
  if ('props' in result) {
    res.json(result.props);
  } else {
    res.json(result);
  }
};
