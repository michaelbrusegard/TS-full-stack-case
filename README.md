# TS-full-stack-case

The hosted version can be accessed [here](https://ts-full-stack-case.michaelbrusegard.com/).

## How to run

You need to have docker installed on your machine.

Start project:

```bash
docker compose up
```

Only run backend and database:

```bash
docker compose up db backend
```

### Dev setup (just for remembering commands, can be ignored)

#### Frontend

Install dependencies with pnpm:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run linter:

```bash
pnpm lint
```

#### Backend

Activate virtual environment:

```bash
source venv/bin/activate
```

Install dependencies with uv:

```bash
uv pip install -r requirements.txt
```

Adding new dependencies with uv (make sure to be inside the backend directory):

```bash
uv pip install <dependency>

# Update requirements.txt
uv pip freeze > requirements.txt
```

Make migrations:

```bash
docker compose exec backend python manage.py makemigrations
```

Run tests for properties app:

```bash
docker compose exec backend python manage.py test properties
```

Do not need to apply migrations or fixtures. This is done automatically in the `compose.yml` file when launching the backend container. But for reference:

```bash
docker compose exec backend python manage.py migrate

docker compose exec backend python manage.py generate_fixtures
```

## Time spent

Dealt with uni stuff while working on this case, so time estimates are a little vague.

- **Backend + Project setup**: ~3 hours work (5 hours total)
- **Frontend**: 10+ hours work

Spent around 2-3 hours with the project after the meeting + some time to deploy it to my server.

## Backend query task and N+1

I was asked to change the backend query that would retrieve all the portfolios to include all its properties underneath a 'properties' field within the same query.

Doing this in Django exposes a quite common problem with the ORM, the N+1 problem. This is when you have a query that retrieves a list of objects and then, for each object in that list, you perform another query to fetch related data. Since the ORM is quite obfuscated (it does a lot for you, and it is not very SQL like) it can be hard to understand how many database queries are being executed under the hood.

If we define the query set for `propertis` like below:

```bash
portfolios = Portfolio.objects.all()
```

It will then execute execute 1 query to get the portfolios and then N queries to get the properties for each portfolio.

The solution is to define the query set like below:

```bash
portfolios = Portfolio.objects.prefetch_related('properties').all()
```

This causes the ORM to fetch all portfolios and then fetch all properties related to the portfolios in a single query. A total of 2 database queries.

There is also an option to use `select_related` which is used when you have a one-to-one or many-to-one relationship. This will fetch the related object in the same query as the main object. This is not the case for this project, but it is good to know. It would be used in the opposite scenario for example if I needed to get the related portfolio for each property.

After reading further up on the topic, there does not seem to be almost any good reason to ever use `objects.all()`. The only scenarios I could think of would maybe a form where one of the fields in the form is a select field and you want to query all the options for the select field (and it is in a dedicated model). Also if the model is static and relatively small, it might be okay to use `objects.all()`.

## A Brief Overview of Our Current Tech Stack

Our backend is built on the Python-based Django REST framework. We use a
PostGIS database to enable geometric operations, as part of our functionality
involves distance and overlap of geometric data.

Our frontend is a React TypeScript project built in Vite. We use Redux to handle
client-side state management (although this will not be part of the case, as we are
considering moving away from this in the future). We use ShadCN as our design
system, with slight tweaks to customize the look and feel according to our Figma
designs. For styling, we use Tailwind CSS. Otherwise, our frontend is a fairly
standard React TypeScript project using functional components.

Architecture-wise, we tend to use Docker containers. We run the backend and
database in containers locally, making it quick and easy to replace the current
local state with fixtures and spin up fresh environments. We currently host our
systems on a VPS running several Docker containers handling our frontend,
backend, and database (along with a few other services that are not relevant
here).

Ready for the case itself? Good! Just one more thing...

We have created a relatively simple starting point for this case that relates to the
contents of our application. We understand that building a fully coherent system
takes time and have avoided overloading the case with features that might be
relevant to the real application, such as hosting, documentation uploads, testing,
or user authentication. However, if you somehow find the case too basic, feel free
to expand upon it by adding features or areas of interest.

## Case description

We want to create an application where a user can register properties and see
them.

Below is a definition of the Property type:

### Property

- Address (str)
- Zip code (str)
- City (str)
- Coordinates (lat-lng)
- Name (str)
- Estimated value (int, in NOK)
- Number of relevant risks (int)
- Number of handled risks (int)
- Total financial risk (int, in NOK)

## Frontend

The general structure of the app should be as follows:

### Home page

The home page should be an overview of the user's properties. Here, the user
should be able to choose to see the properties as a list, or as pins displayed in a
map.

When displaying the properties in a list, you are free to choose the form of
implementation (table / cards / etc), but each entry should display the name of the
property, total financial risk, and something displaying the ratio of risks vs relevant
risks (e.g. "2/4").

### Property details page

Clicking on a property should navigate the user to the property details page. This
page reveals all the details of a property and displays a map with a pin on it to
denote its location.

### Register property page

From the home page, the user should be able to register new properties following
the type definition above.

As part of the create form for the property, the user should be able to click on a
map to extract coordinates. When a point is selected, the user should see the
coordinates that is selected for the property.

From the details page, the user should be able to delete the propery. On
successful delete, the user should then be taken to the home page.

### Guidelines

- Use React with TypeScript for frontend development.
- Create appropriate components and file structure for the functionality.
- Implement intuitive user interfaces for creating and managing portfolios and
properties. (Perfect design is not an evaluation criteria, but positive to see
visually appealing solutions. Usage of tailwind and ShadCN is encouraged)
- Try to handle or describe edge cases appropriately (docstrings, mentions in
README, or orally during walkthrough).

## Backend

Develop a simple Django REST API to store and manage properties. The API
should support CRUD operations.

### Guidelines

- Use Django with PostgreSQL for database management.
- Define a model for properties with appropriate fields
- Implement endpoints for CRUD operations on portfolios and properties
(/api/properties/).
- Include data validation on the fields (number of handled risks should not
exceed number of relevant risks).

We wish you the best of luck with the case and look forward to seeing what you
create!
