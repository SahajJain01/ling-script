import { Lang, Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors = require("cors");

const prisma = new PrismaClient();
const app = express();

const whitelist = ['http://localhost:8100', 'https://sahajjain01.github.io/ling-script'];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // callback(new Error('Not allowed by CORS'));
      callback(null, true);
    }
  }
}
app.use(express.json());
app.use(cors(corsOptions));



app.get("/langs", async (req, res) => {
  const data = await prisma.lang.findMany({
    select: {
      id: true,
      name: true
    }
  });
  res.send(data);
});

app.get("/units/:langId", async (req, res) => {
  const data = await prisma.lang.findFirst({
    select: {
      name: true,
      units: {
        select: {
          id: true,
          name: true
        },
      },
    },
    where: {
      id: Number(req.params.langId)
    }
  });
  res.send(data);
});


app.get("/prompts/:unitId", async (req, res) => {
  const data = await prisma.unit.findFirst({
    include: {
      prompts: {
        select: {
          content: true,
          answer: true
        }
      }
    },
    where: {
      id: Number(req.params.unitId)
    }
  });
  res.send(data?.prompts);
});


app.post('/create/lang', async (req, res) => {
  const { name } = req.body
  const result = await prisma.lang.create({
    data: {
      name
    },
  })
  res.json(result)
})

app.post('/create/unit', async (req, res) => {
  const { langId, name } = req.body
  const result = await prisma.unit.create({
    data: {
      langId,
      name
    },
  })
  res.json(result)
})


app.post('/create/prompt', async (req, res) => {
  const { unitId, content, answer  } = req.body
  const result = await prisma.prompt.create({
    data: {
      unitId,
      content,
      answer
    },
  })
  res.json(result)
})


// app.post(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts?.map((post: Prisma.PostCreateInput) => {
//     return { title: post?.title, content: post?.content }
//   })

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   res.json(result)
// })

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.json(post)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData?.published },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.json(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id }: { id?: string } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.PostWhereInput = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString as string } },
//           { content: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//   res.json(posts)
// })

const server = app.listen(3000, () =>
  console.log(`Server ready at: http://localhost:3000`)
);
