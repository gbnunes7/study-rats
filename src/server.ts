import { app } from './app';
import { setupRoutes } from './routes';

setupRoutes(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
