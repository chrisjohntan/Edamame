import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './ErrorUnexpected.module.css';

function ErrorUnexpected() {
  return (
    <div className={classes.root}>
      <Container>
        <Title className={classes.title}>Unexpected error occurred...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Try refreshing the page or returning home
        </Text>
        <Group justify="center">
          <Button variant="white" size="md" onClick={window.location.reload}>
            Refresh the page
          </Button>
        </Group>
      </Container>
    </div>
  )
}

export default ErrorUnexpected;

