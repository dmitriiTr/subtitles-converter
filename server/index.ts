import express, { Request, Response } from 'express';
import fs from 'fs/promises';

import type { Filter } from './types';

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/api', (_: Request, res: Response) => {
  fs.readFile('server/filters.json', 'utf8').then(file => {
    const parsed = JSON.parse(file) as { filters: Filter[] };
    res.json({ message: 'Hello from server!', filters: parsed.filters });
  });
});

app.listen(PORT, () => {
  //console.log(`Server listening on ${PORT}`);
});