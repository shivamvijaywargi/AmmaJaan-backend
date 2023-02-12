# AmmaJaan

This is an eCommerce Backend written in NodeJS(ExpressJS) with TypeScript

## Tech Badges

Some of the things that I have used

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Next Cloud](https://img.shields.io/badge/Cloudinary-0B94DE?style=for-the-badge&logoColor=white)
![Gmail](https://img.shields.io/badge/Nodemailer-D14836?style=for-the-badge&logo=gmail&logoColor=white)

## Tech Stack

**Client:** Not sure yet😢

**Server:** NodeJS, ExpressJS, TypeScript, MongoDB, Mongoose, JWT

PS: For complete list of packages check out package.json😉

## Features

- AUTH - Register, Login, Logout, Forgot Password, Reset Password
- USER - Get user, update user, delete user, upload avatars
- PRODUCT - Create, get all, get single, update, delete product(s)
- Uses Refresh Token + Access Token mechanism for relatively better security

## API Reference - Only single example since I cannot write all here😅

#### Get all products

```http
  GET /api/v1/products
```

#### Get single product

```http
  GET /api/products/${id}
```

| Parameter | Type               | Description                          |
| :-------- | :----------------- | :----------------------------------- |
| `id`      | `string(ObjectId)` | **Required**. Id of product to fetch |

## Demo

I might make a Swagger documentation in the future, if I can learn it sooner.

## Roadmap

- [ ] Coupon

- [ ] Addresses

- [ ] Order

- [ ] Payment integration

- [ ] Review

- [ ] Wishlist

- [ ] Learn testing first and then implement it

## Installation

Install AmmaJaan with yarn (You can choose others as well but I used yarn)

```bash
  # First of all clone the repo
  git clone https://github.com/shivamvijaywargi/full-stack-eCommerce.git
  # Now cd into the cloned repo
  cd full-stack-eCommerce
  # Now to run server cd into server/
  cd server/
  # First we need to install dependencies
  yarn
  # Finally use this command to run the server in dev mode (For other commands check package.json)
  yarn start:dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file, please checkout the .env.example for a list of variables you will need😊

## Contributing

Contributions are always welcome!

See `contributing.md`(In process) for ways to get started.

Please adhere to this project's `code of conduct`.

## Lessons Learned

### Achieving

- Improved my knowledge on building backend using TS
- Learned about Zod and how to create Zod schemas for validation
- How to create interfaces for mongoose schemas
- First time using formidable and it was a good experience
- Basic API security using express-rate-limit + helmet
- Need something out of built-in fs package, fs-extra is what you need😉
- Create user friendly URLs with Slug (Say **NO** to **63e722d56f4c46aa8c65a82f**)
- Better logging using Winston + Morgan (A level up compared to console logs)
  - PS: Do not block your thread (IFKYK)

### Yet to achieve

There are still a few things I still need to dive into which includes but not limited to

- Docker, ESLint + Prettier, I will try to learn about them first before implementing/using/integrating them in this project
- Use Zod in conjunction with Formidable to be able to create schema to check for fields as well.

## Optimizations

- Used Zod for Schema validation where it was necessary to reduce something like

  ```typescript
  if (!name || !email || ....) {
      return next(new AppErr(...))
  }

  if (name.length < 5) {
      return next(new AppErr(...))
  }
  ```

- Refactored routes to use router.route and chain them instead of router.get, router.post, and so on and so forth

  ```typescript
  router.route('/').post(createProduct).get(getAllProducts);

  router
    .route('/:id')
    .get(getProductById)
    .put(updateProductById)
    .delete(deleteProductById);
  ```

## Authors

- [@shivamvijaywargi](https://www.github.com/shivamvijaywargi)

## 🛠 Skills

HTML, CSS, Javascript, ReactJS, NextJS, NodeJS, ExpressJS, MongoDB, TypeScript

## Feedback

If you have any feedback, please reach out to me at any of the links given below

## 🔗 Links

|                                                                          LinkedIn                                                                           |                                                                   Telegram                                                                   |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
| [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shivamvijaywargi) | [![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://shivamvijaywargi.t.me) |

|                                                                     Twitter                                                                     |                                                                            Instagram                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/shivamvijaywarg) | [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://instagram.com/shivamvijaywargi) |

## Appendix

First of all, thank you for reading through the README and now a request from my end. If you think there is some issue with the code or a piece of code can be improved, please feel free to open an issue, or if possible please submit a PR. I would be glad to learn things and improve myself.
