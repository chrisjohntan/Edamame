import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './Error404.module.css';

function Error404() {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Not found</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        The resource is not available. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" onClick={()=>window.location.reload()}>
          Take me back to main page
        </Button>
      </Group>
    </Container>
  );
}

export default Error404;