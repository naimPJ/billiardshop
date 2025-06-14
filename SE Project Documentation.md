![][image1]

**IT 309 SOFTWARE ENGINEERING**

PROJECT DOCUMENTATION

**BILLIARDSHOP**

Prepared by:  
**Abdulkadir Akay**  
**Naim Pjanić**

Proposed to:  
**Nermina Durmić, Assist. Prof. Dr.**  
**Naida Fatic, Teaching Assistant**

**June 15, 2025**

TABLE OF CONTENTS

Generate your table of contents here.

# **1\. Introduction**

This document represents the basic template of the documentation that you need to submit along with your project. Your documentation *should contain* *all the content* that is mentioned here. However, if you want to add additional sections to the document, rearrange it or redesign it, you are welcome to do so, as long as you keep all of the content that is required here.

As a final note, before submitting your final project version, go over the [project requirements](https://docs.google.com/document/d/1e26z23pBHTyIJYXeYw9F7G6P375fBRej_BKIX7aaAok/edit?usp=sharing) one more time and make sure that your project was done in accordance with them. You may delete these three paragraphs in your final document.

GitHub Repository: https://github.com/naimPJ/billiardshop

## **1.1. About the Project**

BilliardShop is a web application designed for the online retail of billiard equipment and accessories. The application provides users with a seamless and intuitive shopping experience for billiard cues, balls, tables, and related equipment.

Key features of the application include:
- Product browsing with detailed descriptions and images
- Shopping cart system with add/remove functionality
- Product quantity management in cart
- Product search and filtering capabilities
- Order processing system
- Responsive design for desktop and mobile devices

The application is currently in development phase and not yet publicly deployed. Development is actively ongoing on GitHub repository: https://github.com/naimPJ/billiardshop, where project progress and source code can be tracked.

Technical stack consists of:
- Frontend: React.js with modern UI components
- Backend: Node.js with Express.js framework
- Database: MySQL
- API: RESTful architecture

## **1.2. High-level Plan**

The BilliardShop project follows a modern three-tier architecture, implementing a clear separation of concerns between the frontend, backend, and database layers. Here's a detailed breakdown of the system architecture:

### Frontend Layer (Presentation)
- **React.js Application**
  - Components-based architecture for UI elements
  - Context API for state management
  - Responsive design for multiple device types
  - Route-based code splitting for optimized loading

### Backend Layer (Business Logic)
- **Node.js + Express.js Server**
  - RESTful API architecture
  - Modular routing system
  - Authentication middleware
  - Business logic separation

### Database Layer (Data Persistence)
- **MySQL Database**
  - Relational data model
  - ACID compliance
  - Data integrity enforcement
  - Efficient query optimization

### Key Components:

1. **User Interface Components**
   - Product catalog display
   - Shopping cart management
   - User authentication forms
   - Order processing interface

2. **API Endpoints**
   - Product management (`/products`)
   - Cart operations (`/cart`)
   - User authentication (`/auth`)
   - Order processing

3. **Data Management**
   - Product inventory
   - User accounts
   - Shopping carts
   - Order history

### System Integration
- Frontend communicates with backend via RESTful APIs
- Backend handles business logic and database operations
- Database ensures data persistence and integrity
- Authentication system secures user data and operations

### Development Workflow
- Version control with Git
- Feature branch development
- Test-driven development approach
- Continuous integration practices

This architecture ensures:
- Scalability for future growth
- Maintainable and modular codebase
- Secure data handling
- Optimal performance
- Easy feature additions

## **1.3. Project Requirements**

### Functional Requirements

1. **User Authentication and Management**
   - System shall allow users to register with email and password
   - System shall enable user login with credentials
   - System shall maintain user sessions
   - System shall protect user data and privacy
   - System shall allow users to view their profile information

2. **Product Management**
   - System shall display a catalog of billiard products
   - System shall show detailed product information (name, price, image)
   - System shall maintain accurate product inventory
   - System shall support product categorization
   - System shall enable product search and filtering

3. **Shopping Cart Functionality**
   - System shall allow users to add products to cart
   - System shall enable quantity updates in cart
   - System shall support product removal from cart
   - System shall persist cart data between sessions
   - System shall calculate total order value
   - System shall validate product availability

4. **Order Processing**
   - System shall handle checkout process
   - System shall collect shipping information
   - System shall validate order details
   - System shall confirm successful orders
   - System shall maintain order history
   - System shall handle payment processing

5. **Content Management**
   - System shall provide About Us information
   - System shall offer contact functionality
   - System shall display company information
   - System shall maintain product descriptions

### Non-functional Requirements

1. **Performance Requirements**
   - System shall load pages within 2 seconds
   - System shall process cart updates within 1 second
   - System shall handle at least 100 concurrent users
   - Database queries shall complete within 500ms
   - API responses shall return within 1 second

2. **Security Requirements**
   - System shall encrypt all user passwords
   - System shall implement secure session management
   - System shall protect against SQL injection
   - System shall validate all user inputs
   - System shall implement CORS protection
   - System shall secure API endpoints

3. **Reliability Requirements**
   - System shall be available 99.9% of time
   - System shall backup data daily
   - System shall handle errors gracefully
   - System shall maintain data consistency
   - System shall log all critical operations

4. **Usability Requirements**
   - System shall be responsive on all devices
   - System shall provide intuitive navigation
   - System shall display clear error messages
   - System shall support major browsers
   - System shall provide consistent UI/UX
   - System shall be accessible to users with disabilities

5. **Maintainability Requirements**
   - System shall follow MVC architecture
   - System shall implement proper error logging
   - System shall use version control
   - System shall have comprehensive test coverage
   - System shall follow coding standards
   - System shall be properly documented

## **1.4. UML diagrams**

### Activity Diagrams

1. **Registration Process**
   ![Registration Activity Diagram](docs/diagrams/Activity%20Diagram%20Register.png)
   *Figure 1: Activity diagram showing the user registration process*

2. **Login Process**
   ![Login Activity Diagram](docs/diagrams/Activity%20Diagram%20Login.png)
   *Figure 2: Activity diagram showing the user login process*

3. **Product Search Process**
   ![Search Activity Diagram](docs/diagrams/Activity%20Diagram%20Search.png)
   *Figure 3: Activity diagram showing the product search process*

4. **Payment Process**
   ![Payment Activity Diagram](docs/diagrams/Activity%20Diagram%20Payment.png)
   *Figure 4: Activity diagram showing the payment process*

5. **Remove Item Process**
   ![Remove Activity Diagram](docs/diagrams/Activity%20Diagram%20Remove.png)
   *Figure 5: Activity diagram showing the process of removing items from cart*

### Class Diagram

![Class Diagram](docs/diagrams/Class%20Diagram.jpg)
*Figure 6: Class diagram showing the system's class structure and relationships*

### Sequence Diagrams

1. **Registration Process**
   ![Registration Sequence Diagram](docs/diagrams/Sequence%20Registration.jpg)
   *Figure 7: Sequence diagram showing the user registration process*

2. **Login Process**
   ![Login Sequence Diagram](docs/diagrams/Sequence%20Login%201.jpg)
   *Figure 8: Sequence diagram showing the user login process*

3. **Add to Cart Process**
   ![Add to Cart Sequence Diagram](docs/diagrams/Sequence%20AddToCart.jpg)
   *Figure 9: Sequence diagram showing the process of adding items to cart*

4. **Checkout Process**
   ![Checkout Sequence Diagram](docs/diagrams/Sequence%20Checkout.jpg)
   *Figure 10: Sequence diagram showing the checkout process*

5. **Track Order Process**
   ![Track Order Sequence Diagram](docs/diagrams/Sequence%20TrackOrder.jpg)
   *Figure 11: Sequence diagram showing the order tracking process*

# **2\. Project Structure**

## **2.1. Technologies**

Describe or list *what technologies* (programming languages/frameworks) you used in your project for backend, frontend and the database. If you also used some other technologies or third-party tools, you could list them, as well.

~~Afterwards, specify which *coding standard* you used and in which part of your project (was it on the backend, frontend, both, etc.). If you are unclear about coding standards, refer to Week 2 and Week 3 on LMS.~~

## **2.2. Architectural Pattern**

Describe also the architectural pattern that you used and why you chose that pattern. You can put screenshots of your project file organization.

## **2.3. Database Entities**

Provide a list of *tables or entities* you have in your database/schema. If it is not obvious from the name of the table/entity what it is used for, also provide a brief explanation next to it. For example:

* users

* products

* chkt 🡪 stores order checkouts

* …

## **2.4. Design Patterns**

List the *design patterns* that you used in the project, and where they are in your source code (which files or exact line numbers). For example:

* builder pattern: used in the backend, in the file *rest/v1/OrderBuilder.php*

If you have a lot of design patterns, you can also add a separate subsection for type. Moreover, for each pattern, *briefly explain why* you chose to use that pattern and how it helped you out in that case. For example:

* "Since our orders can contain a multitude of parameters, many of them being optional, putting them all as constructor parameters would make our code messy. Therefore, we decided to use the builder pattern instead to create order objects. This makes it possible to build the order step-by-step, and only using the parameters that are necessary for that specific case…"

If you are not clear on what you need write in this section, refer to Week 5 and Week 6 on LMS, where we covered creational, structural and behavioral patterns, and visit [Refactoring.Guru](https://refactoring.guru/design-patterns) for detailed explanations on design patterns and their use cases.

## **2.5. Project Functionalities and Screenshots**

Describe or list the main features of the application and provide a few screenshots of your project.

## **2.6. Tests**

Describe which kinds of tests you wrote for your application (e.g. unit tests, Selenium tests, etc.) and where they are located inside the project.

# **3\. Conclusion**

Provide some closing statements or your final thoughts about the project you implemented. Are you satisfied with the overall implementation you managed to do? Are there any things you think you could improve on in the future? Was there something that was particularly difficult or challenging to implement? 

You can note whatever concluding thoughts you have about the project here, but please *do try* to write something, and not leave this section blank.

# **4\. Individual Contributions**

In this section, each team member should describe their specific contributions to the project. This includes the tasks they were responsible for, and the work they completed. Be as detailed as possible to clearly outline your role and efforts in the project.

Consider mentioning:

* The specific features, research, or components you worked on.  
* Collaboration with other team members and how you contributed to the team's overall progress.


This section helps document the contributions of each member, ensuring transparency and recognition of individual efforts. Please make sure to provide a thoughtful and comprehensive summary rather than leaving this section empty.

**Example:**

**Student 1 (50%)**

He was primarily responsible for the backend development and overall system architecture. His contributions included:

* **System Analysis and Design (SAD) Diagrams**: Created detailed SAD diagrams, including Use Case Diagrams, Sequence Diagrams, and ER Diagrams, to ensure a clear understanding of system requirements.  
* **Backend Development**: Designed and implemented the database using MySQL and built the server-side logic using Node.js and Express.  
* **API Development**: Developed RESTful APIs for data retrieval and manipulation, ensuring smooth communication between the frontend and backend.  
* **Roadmap and Release Plan**: Worked on the project roadmap by setting milestones and defining sprints, ensuring an organized development process.  
* **Collaboration**: Coordinated with another student to ensure the frontend design aligned with the backend functionalities, regularly testing and debugging API responses.

**Student 2 (40%)**

He focused on the frontend development and user experience aspects of the project. Her contributions included:

* **Frontend Development**: Designed and developed the user interface using React.js, ensuring a responsive and intuitive experience.  
* **Integration with Backend**: Connected frontend components with the API endpoints created by John, ensuring seamless data flow between client and server.  
* **Release Planning**: Assisted in structuring the release plan, defining different versions of the application, and prioritizing feature rollouts.  
* **Collaboration**: Worked closely with the second other to ensure UI elements correctly displayed the data retrieved from the backend, conducting joint debugging sessions when necessary.

**The highest percentage each student can have is 50%.** 

[image1]: <data:image/png;base64,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>