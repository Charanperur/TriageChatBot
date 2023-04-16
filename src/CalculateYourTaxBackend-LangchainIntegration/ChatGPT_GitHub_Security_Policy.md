## You

Hi I want to add security policy to my master branch in GitHub. It is a public repository and I want to allow 2 reviewers to review before merging. No direct commits should be allowed on master branch.

## Genie

Hello, to add security policy to your master branch in GitHub, you can follow the below steps:

1. Go to the 'Settings' tab of your repository.
2. Click on 'Branches' from the left sidebar.
3. Under 'Branch Protection Rules,' click on 'Add rule.'
4. In the 'Branch name pattern' field, type 'master' without quotes.
5. Check the box for 'Require pull request reviews before merging.' 
6. Set the number of required reviewers to 2.
7. Check the box for 'Dismiss stale pull request approvals when new commits are pushed'.
8. Check the box for 'Include administrators'.
9. Under 'Restrictions' check the box for 'Restrict who can push to matching branches'.
10. Select the option 'Include the following people or teams', and then add the two reviewers who you want to allow to review before merging.
11. Uncheck the box for 'Allow direct pushes to master branch'.

After completing these steps, no one will be able to directly commit changes to the master branch, and any changes will need to be submitted via pull request. The pull requests will require approval from at least 2 reviewers before it can be merged into the master branch.

## You

How to restrict merge if unit tests are not passing

## Genie

To restrict merge if unit tests are not passing, you can use GitHub Actions. Here are the steps:

1. Create a new GitHub action workflow file in `.github/workflows` directory of your repository. For example: `.github/workflows/test-on-push.yml`

2. Use the `on push` trigger to run the workflow whenever someone pushes changes to the master branch.

```
on:
  push:
    branches: [ master ]
```

3. Create a job in the workflow that runs the unit tests using a testing framework of your choice. You can use a pre-defined Github Action or create your own.

Example:

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies and run tests
        run: |
          yarn
          yarn test
```

4. Add an `if` condition to the deployment job that checks if the tests have passed. If the tests have failed, the condition will prevent the deployment step from running.

Example:

```
jobs:
  test:
    # ...
    
  deploy:
    needs: test
    if: success()
    # Deployment steps...
```

5. Commit and push the workflow file to your repository.

Now, whenever someone pushes changes to the master branch, this GitHub Action will automatically run the unit tests. If the tests fail, the deployment job will not be run, preventing anyone from merging changes into the master branch until the issue is fixed.

## You

How to avoid commits when unit tests are not running correctly?

## Genie

To add a security policy to your master branch in GitHub, follow these steps:

1. Go to the settings tab of your repository.
2. Click on "Branches" from the left sidebar menu.
3. Under "Branch protection rules", select "Add rule".
4. In the "Branch name pattern" field, type "master" (without quotes).
5. Check the box next to "Require pull request reviews before merging".
6. Select "2" from the dropdown menu for "Required approving reviews".
7. Check the box next to "Dismiss stale pull request approvals when new commits are pushed".
8. Check the box next to "Require status checks to pass before merging".
9. Under "Status checks found in the last week for this repository", find the unit test check and enable it by clicking on the checkbox.
10. Click "Create" to save the branch protection rule.

To restrict merges if unit tests are not passing, you need to make sure that the unit tests are configured as a required status check for your repository. Follow the above steps and make sure you have enabled the unit test check under "Require status checks to pass before merging." If the unit tests do not pass, the merge button will be disabled.

To avoid commits when unit tests are not running correctly, you can use pre-commit hooks to run the tests before a commit is made. This will ensure that any changes you make will only be committed if the unit tests pass. You can also use continuous integration (CI) tools like TravisCI or CircleCI to automatically run the unit tests whenever changes are pushed to the repository.

## You

I have a Angular repo in github which I want to deploy. The repo is public and I want a free service to deploy. The application will be connecting to APIs hosted in other locations. 

What options do I have?

## Genie

There are several free options available to deploy your Angular application:

1. **GitHub Pages:** This is a free static site hosting service that can be used to deploy your Angular application. You can follow the steps outlined in the official [Angular documentation](https://angular.io/guide/deployment#deploy-to-github-pages) to deploy your app on GitHub pages.

2. **Netlify:** Netlify is a free hosting service that offers continuous deployment, automatic SSL certificates and CDN support for static sites. You can connect your GitHub repository to Netlify and it will build and deploy your Angular app automatically whenever you push changes to the repository. You can follow the instructions provided on the [Netlify website](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) to deploy your app on Netlify.

3. **Firebase Hosting:** Firebase is a cloud platform by Google that offers a wide range of services including hosting, database, storage and more. Firebase Hosting is a free static web hosting service that can be used to deploy your Angular app. You can follow the steps outlined in the [official Firebase documentation](https://firebase.google.com/docs/hosting/quickstart) to deploy your app on Firebase Hosting.

As for connecting to APIs hosted elsewhere, you simply need to ensure that the API endpoints are accessible from the domain where your app is deployed. Most APIs offer CORS (Cross-Origin Resource Sharing) support which allows accessing them from other domains. In case the APIs do not have CORS enabled, you may have to use a proxy server to forward requests from your app to the APIs.

## You

How can I use github pages for deployment with CD

## Genie

To use GitHub Pages for deployment with continuous deployment (CD), you can use a continuous integration (CI) tool like Travis CI or CircleCI. Both tools integrate well with GitHub and can automatically deploy your Angular app to GitHub Pages after successful builds.

Here is what you need to do:

1. Create a `.travis.yml` or `.circleci/config.yml` file in the root directory of your Angular project. These files are used to define the build and deployment configuration for your app.

2. Configure your CI tool to build and test your Angular app on every push or pull request to your repository. You can use commands like `ng build` and `ng test` to run your tests and build your app.

3. Add a step to your CI build process to deploy your Angular app to GitHub Pages after successful builds. To deploy to GitHub Pages, you will need to create a `gh-pages` branch on your repository and push your built app to this branch. You can use a script like the one below to automate this process:

```bash
# Install dependencies and build app
npm install
npm run build

# Deploy to gh-pages branch
git clone --branch=gh-pages https://github.com/user/repo.git deploy
cd deploy
cp -r ../dist/* .
git add .
git commit -m "Deploy App"
git push origin gh-pages
```

4. Finally, configure your GitHub Pages settings to serve your app from the `gh-pages` branch. Go to your repository's settings page, scroll down to the GitHub Pages section, and select `gh-pages` as the source branch. Save your changes, and your Angular app should now be deployed to GitHub Pages on every successful build.

## You

My application is already in GItHub then what are CI tools available

## Genie

GitHub offers its own CI/CD tool called GitHub Actions, which you can use to automate the testing and deployment processes for your application. 

Other popular CI tools available are:

1. Travis CI
2. CircleCI
3. Jenkins
4. GitLab CI/CD
5. TeamCity

These tools integrate seamlessly with GitHub and provide a wide range of features to automate the testing, building, and deployment of your applications.

## You

How can I create a CI\CD pipeline using github actions and deploy in gh-pages

## Genie

You can create a CI/CD pipeline using Github Actions and deploy to gh-pages by following these steps:

1. Create an Actions workflow YAML file in your repository's `.github/workflows` directory. For example, you could create a file named `ci-cd.yaml`. This file will contain the steps for your CI/CD pipeline.

2. Define the trigger events for when the pipeline runs. For example, you can specify that the pipeline should run on any push to the master branch.

```
name: CI/CD Pipeline

on:
  push:
    branches:
      - master
```

3. Define the jobs that will be executed as part of the pipeline.

```
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Build and Test
      run: |
        npm install
        npm run build
    - name: Deploy to GH Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        publish_dir: ./dist
        github_token: ${{ secrets.GITHUB_TOKEN }}
```

Here, we've defined a single job called "build-and-deploy" that runs on Ubuntu. It contains three steps:

- Checkout: check out the repository code
- Build and Test: install dependencies and run the build script
- Deploy to GH Pages: use the `peaceiris/actions-gh-pages` action to deploy the built app to gh-pages

4. Save and commit the workflow YAML file to your repository. The pipeline will now run automatically whenever there is a push to the master branch.

That's it! Once the pipeline finishes executing, the built app will be deployed to gh-pages and available at https://<username>.github.io/<repository>.

## You

I want to deploy my express api in cloud. What are free options available?

## Genie

There are a lot of free options available to deploy your Express API in the cloud. Here are some of them:

1. Heroku: Heroku is a Platform-as-a-Service (PaaS) that allows you to easily deploy, manage and scale your application. Heroku offers a free tier that will allow you to deploy your Express API with ease.

2. Google Cloud Platform: GCP is a cloud computing platform provided by Google. They offer a free tier which provides a limited amount of resources that can be used to host your Express API. 

3. Microsoft Azure: Azure is another cloud computing platform that offers a free tier. With their free tier, you can deploy your Express API and get up to 10 web, mobile or API apps for free.

4. Amazon Web Services: AWS is the most popular cloud provider and offers many services to host your Express API. They offer a free tier with limited resources that can be used to host your Express API.

These are just some of the free options available to deploy your Express API in the cloud. You can choose any one of these according to your requirement.

## You

Which services can be used to deploy express apis in AWS?

## Genie

There are a few options for deploying Express APIs on AWS:

1. Elastic Beanstalk: It is a managed service that makes it easy to deploy, manage, and scale applications in the AWS Cloud. You can choose to deploy your application using one of the available platforms (e.g., Node.js) and let Elastic Beanstalk handle many of the operational details.

2. EC2: It is a web service that provides resizable compute capacity in the cloud. It provides you with complete control of your computing resources and allows you to configure and run your own web server or application server.

3. Lambda: It enables you to run code without provisioning or managing servers. You can simply upload your code, and Lambda takes care of everything required to run and scale your code.

4. API Gateway: It is a fully managed service that makes it easy for developers to create and deploy secure and scalable APIs.

5. Fargate: It is a serverless compute engine for containers that works with both ECS and EKS. You can run your application as a container and Fargate will take care of running and scaling it.

6. Lightsail: It is an easy-to-use cloud platform that offers everything needed to build and deploy websites, web applications, and more. With Lightsail, you can quickly launch and manage virtual private servers, databases, storage, and more.

These are some of the popular services available on AWS to deploy Express APIs.

## You

How to deploy a service in Elastic Beanstalk and create a CI\CD pipeline. My application repo is on GitHub.

## Genie

Here are the steps to deploy your service in Elastic Beanstalk and create a CI/CD pipeline using CodePipeline:

1. First, you need to create an Elastic Beanstalk environment in your AWS account. You can do this manually through the AWS Management Console or through the AWS CLI. Once you have created the environment, make note of its URL and region.

2. Create an IAM role that allows access to Elastic Beanstalk and permissions for AWS CodePipeline. Attach this role to the EC2 instance profile used by your Elastic Beanstalk environment.

3. In the GitHub repository for your application, create a new file named `.elasticbeanstalk/config.yml`. This file defines the settings for Elastic Beanstalk, such as the environment name and deployment options.

4. In the same GitHub repository, create a YAML file named `buildspec.yml`. This file defines the build and deployment stages for your pipeline. It specifies how your project should be built and tested, and how it should be deployed to Elastic Beanstalk.

5. Create an AWS CodePipeline pipeline that uses your GitHub repository as the source, AWS CodeBuild as the build stage and Elastic Beanstalk as the deployment stage. When you create your pipeline, specify the source repository, branch or tag to monitor, the buildspec file location and the Elastic Beanstalk environment to deploy to.

6. Configure CodePipeline to automatically deploy the changes to Elastic Beanstalk when the pipeline detects new code changes in your GitHub repository.

With these steps, you will have a complete CI/CD pipeline that automates the building and deployment process of your Express API to Elastic Beanstalk.