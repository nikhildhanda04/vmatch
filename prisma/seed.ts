const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding mock users...')

  // Clear existing mock data if needed (optional, uncomment if you want fresh data each time)
  // await prisma.match.deleteMany()
  // await prisma.like.deleteMany()
  // await prisma.photo.deleteMany()
  // await prisma.prompt.deleteMany()
  // await prisma.user.deleteMany({ where: { email: { endsWith: '@example.com' } } })

  const mockUsers = [
    {
      name: 'Aisha',
      email: 'aisha@example.com',
      gender: 'FEMALE',
      interestedIn: 'MALE',
      bio: 'Coffee addict and code enthusiast.',
      age: 20,
      hometown: 'Mumbai',
      branch: 'B.Tech CSE Core',
      batch: '2022',
      year: '2026',
      isHosteler: true,
      height: 64, // 5'4"
      isComplete: true,
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80'
      ],
      prompts: [
        { question: 'A fact about me that surprises people', answer: 'I can solve a Rubik\'s cube in under a minute.' },
        { question: 'I\'m looking for', answer: 'Someone to debug my life.' }
      ]
    },
    {
      name: 'Rohan',
      email: 'rohan@example.com',
      gender: 'MALE',
      interestedIn: 'FEMALE',
      bio: 'Always down for a late-night Maggie session.',
      age: 21,
      hometown: 'Delhi',
      branch: 'B.Tech ECE',
      batch: '2021',
      year: '2025',
      isHosteler: true,
      height: 70, // 5'10"
      isComplete: true,
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      ],
      prompts: [
        { question: 'My favorite spot on campus', Academics: 'The library, but only for the AC.' },
        { question: 'We\'ll get along if', answer: 'You like bad puns.' }
      ]
    },
    {
      name: 'Priya',
      email: 'priya@example.com',
      gender: 'FEMALE',
      interestedIn: 'EVERYONE',
      bio: 'Design student lost in a tech college.',
      age: 19,
      hometown: 'Pune',
      branch: 'B.Tech AIML',
      batch: '2023',
      year: '2027',
      isHosteler: false,
      height: 62, // 5'2"
      isComplete: true,
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80'
      ],
      prompts: [
        { question: 'Dating me is like', answer: 'Finding an extra fry at the bottom of the bag.' }
      ]
    },
    {
      name: 'Kabir',
      email: 'kabir@example.com',
      gender: 'MALE',
      interestedIn: 'FEMALE',
      bio: 'Gym, eat, sleep, repeat.',
      age: 22,
      hometown: 'Chandigarh',
      branch: 'B.Tech IT',
      batch: '2020',
      year: '2024',
      isHosteler: true,
      height: 73, // 6'1"
      isComplete: true,
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
        'https://images.unsplash.com/photo-1488161628813-04466f872507?w=800&q=80',
        'https://images.unsplash.com/photo-1504257432389-523431e5f03a?w=800&q=80'
      ],
      prompts: [
        { question: 'My simple pleasures', answer: 'Hitting a new PR.' },
        { question: 'Typical Sunday', answer: 'Meal prep and regretting my life choices.' }
      ]
    }
  ]

  for (const userData of mockUsers) {
    const { photos, prompts, ...baseData } = userData
    
    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: baseData.email },
      update: baseData,
      create: baseData,
    })

    console.log(`Created/Updated user: ${user.name}`)

    // Handle Photos
    await prisma.photo.deleteMany({ where: { userId: user.id } })
    await prisma.photo.createMany({
      data: photos.map((url, index) => ({
        userId: user.id,
        url,
        order: index
      }))
    })

    // Handle Prompts
    await prisma.prompt.deleteMany({ where: { userId: user.id } })
    await prisma.prompt.createMany({
      data: prompts.map((prompt, index) => ({
        userId: user.id,
        question: prompt.question,
        answer: prompt.answer || 'Something witty.', // fallback
        order: index
      }))
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
