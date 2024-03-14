import { createConnection } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Coach } from '../src/entities/coach.entity';

async function seed() {
  const connection = await createConnection();

  const userRepository = connection.getRepository(User);
  const coachRepository = connection.getRepository(Coach);

  const coachesToCreate = [
    { id: 1, name: 'Jennie', specialization: 'Fitness' },
    { id: 2, name: 'Lisa', specialization: 'Mental Health' },
    { id: 3, name: 'Ruby', specialization: 'Sale' },
  ];

  await coachRepository.insert(coachesToCreate);

  const usersToCreate = [
    { id: 1, username: 'user1', password: 'password1', name: 'User One', coachIds: [] },
    { id: 2, username: 'user2', password: 'password2', name: 'User Two', coachIds: [] },
    { id: 3, username: 'user3', password: 'password3', name: 'User Three', coachIds: [] },
  ];

  for (const user of usersToCreate) {
    const existingUser = await userRepository.findOne({ where: { id: user.id } });
    if (existingUser) {
      console.log(`User with id ${user.id} already exists. Skipping creation.`);
      continue;
    }

    const coaches = await coachRepository.findByIds(user.coachIds);
    const newUser = userRepository.create({
      ...user,
      coaches: coaches,
    });
    await userRepository.insert(newUser);
    console.log(`User with id ${user.id} created successfully.`);
  }

  await connection.close();
}

seed();


