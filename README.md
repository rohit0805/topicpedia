# TOPICPEDIA

1.  Add landing Page > TopicSky

    - Added basic styling
    - Added the Navbar
    - Added the "Explore the Topics" button.

2.  Add Topics Page that list all Topics

    - Added the "Add new Topic" button which routed to /topics/new.
    - Mongoose initialized with database "topicsky"
    - model created with name "Topics"
    - Show all the saved Topics

3.  Create the "/topic/:id/articles" routes which shows all articles.

    - model created with name "Articles"
    - Created route "/topic/:id/articles/new" for Article form.
    - Created route "/topic/:topicid/articles/:articleid/show" for Showing the article route.
    - Created route "/topic/:topicid/articles/:articleid/edit" for Edit Article form.
    - Created PUT route "/topic/:topicid/articles/:articleid" for updating the editted article using method-override and redirecting back to show Route.

4.  Created 'routes' folder

    - Created landing,topics and articles files.
    - Refactored all the routes.

5.  Created 'register,login,logout' routes.
    - Created a register template.
    - Register route validation for correct info.
    - Login route validation for correct info.
    - Created a JWT token if Login is successful and stored it in a session.
    - Created a Logout for destroying Token.
    - AuthenticateToken middleware created for authorizing the routes.
