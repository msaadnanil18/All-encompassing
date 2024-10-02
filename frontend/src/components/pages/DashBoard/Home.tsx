import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <Typography.Title level={4}>Welcome to the Dashboard</Typography.Title>
      </Card>
    </motion.div>
  );
};

export default Home;
