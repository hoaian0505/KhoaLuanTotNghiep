[1mdiff --git a/.babelrc b/.babelrc[m
[1mindex 3cac5b1..456751f 100644[m
[1m--- a/.babelrc[m
[1m+++ b/.babelrc[m
[36m@@ -1,6 +1,3 @@[m
 {[m
[31m-    "presets": ["@babel/preset-env", "@babel/preset-react"],[m
[31m-    "plugins": [[m
[31m-        ["@babel/transform-runtime"][m
[31m-    ][m
[31m-}[m
[32m+[m[32m    "presets": ["@babel/preset-env", "@babel/preset-react"][m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/.gitlab-ci.yml b/.gitlab-ci.yml[m
[1mnew file mode 100644[m
[1mindex 0000000..4a26f84[m
[1m--- /dev/null[m
[1m+++ b/.gitlab-ci.yml[m
[36m@@ -0,0 +1,214 @@[m
[32m+[m[32minclude:[m
[32m+[m[32m  - template: Code-Quality.gitlab-ci.yml[m
[32m+[m[32m  - template: Security/Container-Scanning.gitlab-ci.yml[m
[32m+[m[32m  - template: Security/License-Management.gitlab-ci.yml[m
[32m+[m[32m  # - template: Security/DAST.gitlab-ci.yml[m
[32m+[m[32m  - template: Security/SAST.gitlab-ci.yml[m
[32m+[m[32m  - template: Security/Dependency-Scanning.gitlab-ci.yml[m
[32m+[m[32mstages:[m
[32m+[m[32m  - test[m
[32m+[m[32m  - build[m
[32m+[m[32m  - test_img[m
[32m+[m[32m  - predeploy[m
[32m+[m[32m  - deploy[m
[32m+[m[32m  - test_deploy[m
[32m+[m[32m#### this is for template[m
[32m+[m[32mdependency_scanning:[m
[32m+[m[32m  stage: test[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  artifacts:[m
[32m+[m[32m    expire_in: 1 week[m
[32m+[m[32m    paths:[m
[32m+[m[32m      - gl-dependency-scanning-report.json[m
[32m+[m[32m  except:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - release[m
[32m+[m[32m    - master[m
[32m+[m[32msast:[m
[32m+[m[32m  stage: test[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m  artifacts:[m
[32m+[m[32m    expire_in: 1 week[m
[32m+[m[32m    paths:[m
[32m+[m[32m      - gl-sast-report.json[m
[32m+[m[32m  except:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - release[m
[32m+[m[32m    - master[m
[32m+[m
[32m+[m[32mlicense_management:[m
[32m+[m[32m  stage: test[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m  artifacts:[m
[32m+[m[32m    expire_in: 1 week[m
[32m+[m[32m    paths:[m
[32m+[m[32m      - gl-license-management-report.json[m
[32m+[m[32m  except:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - release[m
[32m+[m[32m    - master[m
[32m+[m
[32m+[m[32mcode_quality:[m
[32m+[m[32m  stage: test[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m  artifacts:[m
[32m+[m[32m    expire_in: 1 week[m
[32m+[m[32m    paths:[m
[32m+[m[32m      - gl-code-quality-report.json[m
[32m+[m[32m  except:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - release[m
[32m+[m[32m    - master[m
[32m+[m
[32m+[m[32mcontainer_scanning:[m
[32m+[m[32m  stage: test_img[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - master[m
[32m+[m[32m    - release[m
[32m+[m[32m  artifacts:[m
[32m+[m[32m    expire_in: 1 week[m
[32m+[m[32m    paths:[m
[32m+[m[32m      - gl-container-scanning-report.json[m
[32m+[m
[32m+[m[32m#### this is where you start to EDIT[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m[32mbuild_dev:[m
[32m+[m[32m  image: docker:latest[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  services:[m
[32m+[m[32m    - docker:dind[m
[32m+[m[32m  before_script:[m
[32m+[m[32m    - docker login -u $CI_REGISTRY_USER -p "$CI_JOB_TOKEN" $CI_REGISTRY[m
[32m+[m[32m  stage: build[m
[32m+[m[32m  script:[m
[32m+[m[32m    - cp $DEV_DOCKERFILE Dockerfile[m
[32m+[m[32m    - docker build -f Dockerfile --pull -t $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA -t $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:latest .[m
[32m+[m[32m    - docker push $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m    - docker push $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:latest[m
[32m+[m[32m  after_script:[m
[32m+[m[32m    - docker logout $CI_REGISTRY[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32m    - release[m
[32m+[m[32mbuild:[m
[32m+[m[32m  image: docker:latest[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - docker[m
[32m+[m[32m  services:[m
[32m+[m[32m    - docker:dind[m
[32m+[m[32m  before_script:[m
[32m+[m[32m    - docker login -u $CI_REGISTRY_USER -p "$CI_JOB_TOKEN" $CI_REGISTRY[m
[32m+[m[32m  stage: build[m
[32m+[m[32m  script:[m
[32m+[m[32m    - cp $DOCKERFILE Dockerfile[m
[32m+[m[32m    - docker build -f Dockerfile --pull -t $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA -t $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:latest .[m
[32m+[m[32m    - docker push $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m    - docker push $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:latest[m
[32m+[m[32m  after_script:[m
[32m+[m[32m    - docker logout $CI_REGISTRY[m
[32m+[m[32m  only:[m
[32m+[m[32m    - master[m
[32m+[m[32m### DEV DEPLOYMENT[m
[32m+[m[32mpredeploy:[m
[32m+[m[32m  stage: predeploy[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - gcalls_dev[m
[32m+[m[32m  script:[m
[32m+[m[32m    - docker stop $CI_PROJECT_NAME[m
[32m+[m[32m    - yes y | docker image prune[m
[32m+[m[32m  allow_failure: true[m
[32m+[m[32m  only:[m
[32m+[m[32m    - development[m
[32m+[m[32mdeploy_dev:[m
[32m+[m[32m  stage: deploy[m
[32m+[m[32m  tags:[m
[32m+[m[32m    - gcalls_dev[m
[32m+[m[32m  environment:[m
[32m+[m[32m    name: development[m
[32m+[m[32m  before_script:[m
[32m+[m[32m    - docker login -u $CI_REGISTRY_USER -p "$CI_JOB_TOKEN" $CI_REGISTRY[m
[32m+[m[32m    - docker pull $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m    - cp $NGINX_DEFAULTS /home/gcalls/config/defaults.conf[m
[32m+[m[32m    - cp $NGINX_DEV /home/gcalls/config/$CI_PROJECT_NAME.conf[m
[32m+[m[32m    - cp $DHPARAM /home/gcalls/ssl/dhparam.pem[m
[32m+[m[32m    - cp $GCALLVN_CRT /home/gcalls/ssl/gcall.vn-all.crt[m
[32m+[m[32m    - cp $GCALLVN_KEY /home/gcalls/ssl/gcall.vn.key[m
[32m+[m[32m  script:[m
[32m+[m[32m    - cp $DEV_ENV /home/gcalls/env/$CI_PROJECT_NAME.env[m
[32m+[m[32m    - docker run --rm -d --name $CI_PROJECT_NAME -p $PORT:$PORT --network gcalls_dev -v /home/gcalls/env/$CI_PROJECT_NAME.env:/app/src/.env $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m  after_script:[m
[32m+[m[32m    - docker restart nginx[m
[32m+[m[32m    - docker logs $CI_PROJECT_NAME[m
[32m+[m[32m    - docker logout[m
[32m+[m[32m  only:[m
[32m+[m[32m      - development[m
[32m+[m
[32m+[m[32m# ### PRODUCT DEPLOYMENT[m
[32m+[m[32m# deploy_prod:[m
[32m+[m[32m#   stage: deploy[m
[32m+[m[32m#   tags:[m
[32m+[m[32m#     - tools_prod[m
[32m+[m[32m#   environment:[m
[32m+[m[32m#     name: production[m
[32m+[m[32m#     url: https://cdrs.gcall.vn[m
[32m+[m[32m#   before_script:[m
[32m+[m[32m#     - docker login -u $CI_REGISTRY_USER -p "$CI_JOB_TOKEN" $CI_REGISTRY[m
[32m+[m[32m#   script:[m
[32m+[m[32m#     - docker pull $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m#     - docker-compose up --build -d[m
[32m+[m[32m#     - docker cp tool-cdrs:/usr/local/src/app/client/dist/. /home/devops/private/public/cdrs-ui[m
[32m+[m[32m#     - cp -R ./nginx/cdrs.gcall.vn.conf /home/devops/private/nginx/conf.d/[m
[32m+[m[32m#     - docker restart nginx[m
[32m+[m[32m#     - echo $CI_ENVIRONMENT_URL > environment_url.txt[m
[32m+[m[32m#   after_script:[m
[32m+[m[32m#     - docker logout[m
[32m+[m[32m#   artifacts:[m
[32m+[m[32m#     paths:[m
[32m+[m[32m#       - environment_url.txt[m
[32m+[m[32m#   when: manual[m
[32m+[m[32m#   only:[m
[32m+[m[32m#     - master[m
[32m+[m
[32m+[m[32m# deploy_release:[m
[32m+[m[32m#   stage: deploy[m
[32m+[m[32m#   tags:[m
[32m+[m[32m#     - tools_prod[m
[32m+[m[32m#   environment:[m
[32m+[m[32m#     name: production[m
[32m+[m[32m#     url: https://cdrs.gcall.vn[m
[32m+[m[32m#   before_script:[m
[32m+[m[32m#     - docker login -u $CI_REGISTRY_USER -p "$CI_JOB_TOKEN" $CI_REGISTRY[m
[32m+[m[32m#   script:[m
[32m+[m[32m#     - docker pull $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG:$CI_COMMIT_SHA[m
[32m+[m[32m#     - docker-compose up --build -d[m
[32m+[m[32m#     - docker cp tool-cdrs:/usr/local/src/app/client/dist/. /home/devops/private/public/cdrs-ui[m
[32m+[m[32m#     - cp -R ./nginx/cdrs.gcall.vn.conf /home/devops/private/nginx/conf.d/[m
[32m+[m[32m#     - docker restart nginx[m
[32m+[m[32m#     - echo $CI_ENVIRONMENT_URL > environment_url.txt[m
[32m+[m[32m#   after_script:[m
[32m+[m[32m#     - docker logout[m
[32m+[m[32m#   artifacts:[m
[32m+[m[32m#     paths:[m
[32m+[m[32m#       - environment_url.txt[m
[32m+[m[32m#   when: manual[m
[32m+[m[32m#   only:[m
[32m+[m[32m#     - master[m
[32m+[m
[1mdiff --git a/API_format.md b/API_format.md[m
[1mnew file mode 100644[m
[1mindex 0000000..6abfd2f[m
[1m--- /dev/null[m
[1m+++ b/API_format.md[m
[36m@@ -0,0 +1,390 @@[m
[32m+[m[32m# API Fortmat CrawlDataProject[m[41m[m
[32m+[m[32m## URL: https://mydomain.com/*[m[41m[m
[32m+[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET COMPANY INFOMATIONS[m[41m[m
[32m+[m[32m### URL: company[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[41m    [m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## CREATE NEW COMPANY INFOMATION[m[41m[m
[32m+[m[32m### URL: company[m[41m[m
[32m+[m[32m### Method: POST[m[41m[m
[32m+[m[32m### body:[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m     {[m[41m[m
[32m+[m[32m        _id:string,[m[41m[m
[32m+[m[32m        Page:number,[m[41m[m
[32m+[m[32m        Field:string,[m[41m[m
[32m+[m[32m        CompanyName:string,[m[41m[m
[32m+[m[32m        Adress:string,[m[41m[m
[32m+[m[32m        Tel:string,[m[41m[m
[32m+[m[32m        Email:string,[m[41m[m
[32m+[m[32m        Website:string,[m[41m[m
[32m+[m[32m        expand:[{[m[41m[m
[32m+[m[32m            NameContact:string,[m[41m[m
[32m+[m[32m            EmailContact:string,[m[41m[m
[32m+[m[32m            CellPhoneContact:string[m[41m[m
[32m+[m[32m        }][m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:[m[41m [m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## UPDATE LINH VUC CHO COMPANY[m[41m[m
[32m+[m[32m### URL: company/:field[m[41m[m
[32m+[m[32m### Method: PUT[m[41m[m
[32m+[m[32m### body:[m[41m[m
[32m+[m[32m    {[m[41m[m
[32m+[m[32m       Field: newField;[m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:[m[41m [m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## DELETE COMPANY THEO LINHVUC[m[41m[m
[32m+[m[32m### URL: company/field/:field[m[41m[m
[32m+[m[32m### Method: DELETE[m[41m  [m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET DATA WITH LINHVUC IN DATABASE COLLECTION[m[41m[m
[32m+[m[32m### URL: company/:field[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET DATA WITH LINHVUC AND PAGE IN DATABASE COLLECTION[m[41m[m
[32m+[m[32m### URL: company/:field/:page[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET COMPANY INFOMATIONS FROM WEB[m[41m[m
[32m+[m[32m### URL: getlink/:page[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Lấy thông tin từ web với pages[m[41m[m
[32m+[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            Page:number,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            CompanyName:string,[m[41m[m
[32m+[m[32m            Adress:string,[m[41m[m
[32m+[m[32m            Tel:string,[m[41m[m
[32m+[m[32m            Email:string,[m[41m[m
[32m+[m[32m            Website:string,[m[41m[m
[32m+[m[32m            expand:[{[m[41m[m
[32m+[m[32m                NameContact:string,[m[41m[m
[32m+[m[32m                EmailContact:string,[m[41m[m
[32m+[m[32m                CellPhoneContact:string[m[41m[m
[32m+[m[32m            }][m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[41m    [m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET ALL LINHVUC IN DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/allfields[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:{[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET PAGE OF LINHVUC IN DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/page/:field[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            TotalPages:number,[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET PAGE OF LATEST LINHVUC IN DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/pagelast[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            TotalPages:number,[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## GET LATEST LINHVUC IN DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/fieldlast[m[41m[m
[32m+[m[32m### Method: GET[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result: {[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## CREATE NEW LINHVUC[m[41m[m
[32m+[m[32m### URL: field[m[41m[m
[32m+[m[32m### Method: POST[m[41m[m
[32m+[m[32m### body:[m[41m[m
[32m+[m[32m     {[m[41m[m
[32m+[m[32m        _id:string,[m[41m[m
[32m+[m[32m        link:String,[m[41m[m
[32m+[m[32m        Field:string,[m[41m[m
[32m+[m[32m        TotalPages:number[m[41m[m
[32m+[m[32m    }[m[41m[m
[32m+[m[41m[m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:[m[41m [m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            link:String,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            TotalPages:number[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## DELETE DATABASE LINHVUC THEO LINHVUC[m[41m[m
[32m+[m[32m### URL: field/:field[m[41m[m
[32m+[m[32m### Method: DELETE[m[41m  [m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## UPDATE LINHVUC CHO DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/:field[m[41m[m
[32m+[m[32m### Method: PUT[m[41m  [m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:[m[41m [m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            _id:string,[m[41m[m
[32m+[m[32m            link:String,[m[41m[m
[32m+[m[32m            Field:string,[m[41m[m
[32m+[m[32m            TotalPages:number[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m[41m[m
[32m+[m[41m[m
[32m+[m[32m## CHECK LINK TRONG DATABASE LINHVUC[m[41m[m
[32m+[m[32m### URL: field/link/:link[m[41m[m
[32m+[m[32m### Method: GET[m[41m  [m
[32m+[m[32m### Response[m[41m[m
[32m+[m[32m```json[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:true,[m[41m[m
[32m+[m[32m    result:[[m[41m[m
[32m+[m[32m        if response.length == 0[m[41m[m
[32m+[m[32m            return true[m[41m[m
[32m+[m[32m        else[m[41m[m
[32m+[m[32m            return false[m[41m[m
[32m+[m[32m    ][m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m//TH lỗi[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    success:false,[m[41m[m
[32m+[m[32m    message:"String"[m[41m[m
[32m+[m[32m}[m[41m[m
[32m+[m[32m```[m
\ No newline at end of file[m
[1mdiff --git a/UnitText.docx b/UnitText.docx[m
[1mnew file mode 100644[m
[1mindex 0000000..5029adf[m
Binary files /dev/null and b/UnitText.docx differ
[1mdiff --git a/dist/bundle.js b/dist/bundle.js[m
[1mindex a930e6a..5526b70 100644[m
[1m--- a/dist/bundle.js[m
[1m+++ b/dist/bundle.js[m
[36m@@ -86,39 +86,6 @@[m
 /************************************************************************/[m
 /******/ ({[m
 [m
[31m-/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":[m
[31m-/*!**********************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***![m
[31m-  \**********************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _assertThisInitialized(self) {\n  if (self === void 0) {\n    throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n  }\n\n  return self;\n}\n\nmodule.exports = _assertThisInitialized;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/assertThisInitialized.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":[m
[31m-/*!***************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***![m
[31m-  \***************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\nmodule.exports = _classCallCheck;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classCallCheck.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/createClass.js":[m
[31m-/*!************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***![m
[31m-  \************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\nmodule.exports = _createClass;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/createClass.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
 /***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":[m
 /*!***************************************************************!*\[m
   !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***![m
[36m@@ -226,18 +193,6 @@[m [meval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) *[m
 [m
 /***/ }),[m
 [m
[31m-/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":[m
[31m-/*!******************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***![m
[31m-  \******************************************************************/[m
[31m-/*! exports provided: default */[m
[31m-/***/ (function(module, __webpack_exports__, __webpack_require__) {[m
[31m-[m
[31m-"use strict";[m
[31m-eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _inheritsLoose; });\nfunction _inheritsLoose(subClass, superClass) {\n  subClass.prototype = Object.create(superClass.prototype);\n  subClass.prototype.constructor = subClass;\n  subClass.__proto__ = superClass;\n}\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
 /***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":[m
 /*!********************************************************************!*\[m
   !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***![m
[36m@@ -354,29 +309,7 @@[m [meval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) *[m
 /***/ (function(module, __webpack_exports__, __webpack_require__) {[m
 [m
 "use strict";[m
[31m-eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _typeof; });\nfunction _typeof(obj) {\n  if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n    _typeof = function _typeof(obj) {\n      return typeof obj;\n    };\n  } else {\n    _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n    };\n  }\n\n  return _typeof(obj);\n}\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/esm/typeof.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":[m
[31m-/*!***************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***![m
[31m-  \***************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _getPrototypeOf(o) {\n  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {\n    return o.__proto__ || Object.getPrototypeOf(o);\n  };\n  return _getPrototypeOf(o);\n}\n\nmodule.exports = _getPrototypeOf;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/getPrototypeOf.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/inherits.js":[m
[31m-/*!*********************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***![m
[31m-  \*********************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports, __webpack_require__) {[m
[31m-[m
[31m-eval("var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ \"./node_modules/@babel/runtime/helpers/setPrototypeOf.js\");\n\nfunction _inherits(subClass, superClass) {\n  if (typeof superClass !== \"function\" && superClass !== null) {\n    throw new TypeError(\"Super expression must either be null or a function\");\n  }\n\n  subClass.prototype = Object.create(superClass && superClass.prototype, {\n    constructor: {\n      value: subClass,\n      writable: true,\n      configurable: true\n    }\n  });\n  if (superClass) setPrototypeOf(subClass, superClass);\n}\n\nmodule.exports = _inherits;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/inherits.js?");[m
[32m+[m[32meval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return _typeof; });\nfunction _typeof2(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof2(obj); }\n\nfunction _typeof(obj) {\n  if (typeof Symbol === \"function\" && _typeof2(Symbol.iterator) === \"symbol\") {\n    _typeof = function _typeof(obj) {\n      return _typeof2(obj);\n    };\n  } else {\n    _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : _typeof2(obj);\n    };\n  }\n\n  return _typeof(obj);\n}\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/esm/typeof.js?");[m
 [m
 /***/ }),[m
 [m
[36m@@ -391,61 +324,6 @@[m [meval("function _inheritsLoose(subClass, superClass) {\n  subClass.prototype = Ob[m
 [m
 /***/ }),[m
 [m
[31m-/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":[m
[31m-/*!**************************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***![m
[31m-  \**************************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports, __webpack_require__) {[m
[31m-[m
[31m-eval("var _typeof = __webpack_require__(/*! ../helpers/typeof */ \"./node_modules/@babel/runtime/helpers/typeof.js\");\n\nvar assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ \"./node_modules/@babel/runtime/helpers/assertThisInitialized.js\");\n\nfunction _possibleConstructorReturn(self, call) {\n  if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) {\n    return call;\n  }\n\n  return assertThisInitialized(self);\n}\n\nmodule.exports = _possibleConstructorReturn;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":[m
[31m-/*!***************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***![m
[31m-  \***************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _setPrototypeOf(o, p) {\n  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {\n    o.__proto__ = p;\n    return o;\n  };\n\n  return _setPrototypeOf(o, p);\n}\n\nmodule.exports = _setPrototypeOf;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/setPrototypeOf.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/helpers/typeof.js":[m
[31m-/*!*******************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***![m
[31m-  \*******************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports) {[m
[31m-[m
[31m-eval("function _typeof(obj) {\n  if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n    module.exports = _typeof = function _typeof(obj) {\n      return typeof obj;\n    };\n  } else {\n    module.exports = _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n    };\n  }\n\n  return _typeof(obj);\n}\n\nmodule.exports = _typeof;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/typeof.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":[m
[31m-/*!*********************************************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***![m
[31m-  \*********************************************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports, __webpack_require__) {[m
[31m-[m
[31m-eval("/**\n * Copyright (c) 2014-present, Facebook, Inc.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\nvar runtime = (function (exports) {\n  \"use strict\";\n\n  var Op = Object.prototype;\n  var hasOwn = Op.hasOwnProperty;\n  var undefined; // More compressible than void 0.\n  var $Symbol = typeof Symbol === \"function\" ? Symbol : {};\n  var iteratorSymbol = $Symbol.iterator || \"@@iterator\";\n  var asyncIteratorSymbol = $Symbol.asyncIterator || \"@@asyncIterator\";\n  var toStringTagSymbol = $Symbol.toStringTag || \"@@toStringTag\";\n\n  function wrap(innerFn, outerFn, self, tryLocsList) {\n    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.\n    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;\n    var generator = Object.create(protoGenerator.prototype);\n    var context = new Context(tryLocsList || []);\n\n    // The ._invoke method unifies the implementations of the .next,\n    // .throw, and .return methods.\n    generator._invoke = makeInvokeMethod(innerFn, self, context);\n\n    return generator;\n  }\n  exports.wrap = wrap;\n\n  // Try/catch helper to minimize deoptimizations. Returns a completion\n  // record like context.tryEntries[i].completion. This interface could\n  // have been (and was previously) designed to take a closure to be\n  // invoked without arguments, but in all the cases we care about we\n  // already have an existing method we want to call, so there's no need\n  // to create a new function object. We can even get away with assuming\n  // the method takes exactly one argument, since that happens to be true\n  // in every case, so we don't have to touch the arguments object. The\n  // only additional allocation required is the completion record, which\n  // has a stable shape and so hopefully should be cheap to allocate.\n  function tryCatch(fn, obj, arg) {\n    try {\n      return { type: \"normal\", arg: fn.call(obj, arg) };\n    } catch (err) {\n      return { type: \"throw\", arg: err };\n    }\n  }\n\n  var GenStateSuspendedStart = \"suspendedStart\";\n  var GenStateSuspendedYield = \"suspendedYield\";\n  var GenStateExecuting = \"executing\";\n  var GenStateCompleted = \"completed\";\n\n  // Returning this object from the innerFn has the same effect as\n  // breaking out of the dispatch switch statement.\n  var ContinueSentinel = {};\n\n  // Dummy constructor functions that we use as the .constructor and\n  // .constructor.prototype properties for functions that return Generator\n  // objects. For full spec compliance, you may wish to configure your\n  // minifier not to mangle the names of these two functions.\n  function Generator() {}\n  function GeneratorFunction() {}\n  function GeneratorFunctionPrototype() {}\n\n  // This is a polyfill for %IteratorPrototype% for environments that\n  // don't natively support it.\n  var IteratorPrototype = {};\n  IteratorPrototype[iteratorSymbol] = function () {\n    return this;\n  };\n\n  var getProto = Object.getPrototypeOf;\n  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));\n  if (NativeIteratorPrototype &&\n      NativeIteratorPrototype !== Op &&\n      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {\n    // This environment has a native %IteratorPrototype%; use it instead\n    // of the polyfill.\n    IteratorPrototype = NativeIteratorPrototype;\n  }\n\n  var Gp = GeneratorFunctionPrototype.prototype =\n    Generator.prototype = Object.create(IteratorPrototype);\n  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;\n  GeneratorFunctionPrototype.constructor = GeneratorFunction;\n  GeneratorFunctionPrototype[toStringTagSymbol] =\n    GeneratorFunction.displayName = \"GeneratorFunction\";\n\n  // Helper for defining the .next, .throw, and .return methods of the\n  // Iterator interface in terms of a single ._invoke method.\n  function defineIteratorMethods(prototype) {\n    [\"next\", \"throw\", \"return\"].forEach(function(method) {\n      prototype[method] = function(arg) {\n        return this._invoke(method, arg);\n      };\n    });\n  }\n\n  exports.isGeneratorFunction = function(genFun) {\n    var ctor = typeof genFun === \"function\" && genFun.constructor;\n    return ctor\n      ? ctor === GeneratorFunction ||\n        // For the native GeneratorFunction constructor, the best we can\n        // do is to check its .name property.\n        (ctor.displayName || ctor.name) === \"GeneratorFunction\"\n      : false;\n  };\n\n  exports.mark = function(genFun) {\n    if (Object.setPrototypeOf) {\n      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);\n    } else {\n      genFun.__proto__ = GeneratorFunctionPrototype;\n      if (!(toStringTagSymbol in genFun)) {\n        genFun[toStringTagSymbol] = \"GeneratorFunction\";\n      }\n    }\n    genFun.prototype = Object.create(Gp);\n    return genFun;\n  };\n\n  // Within the body of any async function, `await x` is transformed to\n  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test\n  // `hasOwn.call(value, \"__await\")` to determine if the yielded value is\n  // meant to be awaited.\n  exports.awrap = function(arg) {\n    return { __await: arg };\n  };\n\n  function AsyncIterator(generator) {\n    function invoke(method, arg, resolve, reject) {\n      var record = tryCatch(generator[method], generator, arg);\n      if (record.type === \"throw\") {\n        reject(record.arg);\n      } else {\n        var result = record.arg;\n        var value = result.value;\n        if (value &&\n            typeof value === \"object\" &&\n            hasOwn.call(value, \"__await\")) {\n          return Promise.resolve(value.__await).then(function(value) {\n            invoke(\"next\", value, resolve, reject);\n          }, function(err) {\n            invoke(\"throw\", err, resolve, reject);\n          });\n        }\n\n        return Promise.resolve(value).then(function(unwrapped) {\n          // When a yielded Promise is resolved, its final value becomes\n          // the .value of the Promise<{value,done}> result for the\n          // current iteration.\n          result.value = unwrapped;\n          resolve(result);\n        }, function(error) {\n          // If a rejected Promise was yielded, throw the rejection back\n          // into the async generator function so it can be handled there.\n          return invoke(\"throw\", error, resolve, reject);\n        });\n      }\n    }\n\n    var previousPromise;\n\n    function enqueue(method, arg) {\n      function callInvokeWithMethodAndArg() {\n        return new Promise(function(resolve, reject) {\n          invoke(method, arg, resolve, reject);\n        });\n      }\n\n      return previousPromise =\n        // If enqueue has been called before, then we want to wait until\n        // all previous Promises have been resolved before calling invoke,\n        // so that results are always delivered in the correct order. If\n        // enqueue has not been called before, then it is important to\n        // call invoke immediately, without waiting on a callback to fire,\n        // so that the async generator function has the opportunity to do\n        // any necessary setup in a predictable way. This predictability\n        // is why the Promise constructor synchronously invokes its\n        // executor callback, and why async functions synchronously\n        // execute code before the first await. Since we implement simple\n        // async functions in terms of async generators, it is especially\n        // important to get this right, even though it requires care.\n        previousPromise ? previousPromise.then(\n          callInvokeWithMethodAndArg,\n          // Avoid propagating failures to Promises returned by later\n          // invocations of the iterator.\n          callInvokeWithMethodAndArg\n        ) : callInvokeWithMethodAndArg();\n    }\n\n    // Define the unified helper method that is used to implement .next,\n    // .throw, and .return (see defineIteratorMethods).\n    this._invoke = enqueue;\n  }\n\n  defineIteratorMethods(AsyncIterator.prototype);\n  AsyncIterator.prototype[asyncIteratorSymbol] = function () {\n    return this;\n  };\n  exports.AsyncIterator = AsyncIterator;\n\n  // Note that simple async functions are implemented on top of\n  // AsyncIterator objects; they just return a Promise for the value of\n  // the final result produced by the iterator.\n  exports.async = function(innerFn, outerFn, self, tryLocsList) {\n    var iter = new AsyncIterator(\n      wrap(innerFn, outerFn, self, tryLocsList)\n    );\n\n    return exports.isGeneratorFunction(outerFn)\n      ? iter // If outerFn is a generator, return the full iterator.\n      : iter.next().then(function(result) {\n          return result.done ? result.value : iter.next();\n        });\n  };\n\n  function makeInvokeMethod(innerFn, self, context) {\n    var state = GenStateSuspendedStart;\n\n    return function invoke(method, arg) {\n      if (state === GenStateExecuting) {\n        throw new Error(\"Generator is already running\");\n      }\n\n      if (state === GenStateCompleted) {\n        if (method === \"throw\") {\n          throw arg;\n        }\n\n        // Be forgiving, per 25.3.3.3.3 of the spec:\n        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume\n        return doneResult();\n      }\n\n      context.method = method;\n      context.arg = arg;\n\n      while (true) {\n        var delegate = context.delegate;\n        if (delegate) {\n          var delegateResult = maybeInvokeDelegate(delegate, context);\n          if (delegateResult) {\n            if (delegateResult === ContinueSentinel) continue;\n            return delegateResult;\n          }\n        }\n\n        if (context.method === \"next\") {\n          // Setting context._sent for legacy support of Babel's\n          // function.sent implementation.\n          context.sent = context._sent = context.arg;\n\n        } else if (context.method === \"throw\") {\n          if (state === GenStateSuspendedStart) {\n            state = GenStateCompleted;\n            throw context.arg;\n          }\n\n          context.dispatchException(context.arg);\n\n        } else if (context.method === \"return\") {\n          context.abrupt(\"return\", context.arg);\n        }\n\n        state = GenStateExecuting;\n\n        var record = tryCatch(innerFn, self, context);\n        if (record.type === \"normal\") {\n          // If an exception is thrown from innerFn, we leave state ===\n          // GenStateExecuting and loop back for another invocation.\n          state = context.done\n            ? GenStateCompleted\n            : GenStateSuspendedYield;\n\n          if (record.arg === ContinueSentinel) {\n            continue;\n          }\n\n          return {\n            value: record.arg,\n            done: context.done\n          };\n\n        } else if (record.type === \"throw\") {\n          state = GenStateCompleted;\n          // Dispatch the exception by looping back around to the\n          // context.dispatchException(context.arg) call above.\n          context.method = \"throw\";\n          context.arg = record.arg;\n        }\n      }\n    };\n  }\n\n  // Call delegate.iterator[context.method](context.arg) and handle the\n  // result, either by returning a { value, done } result from the\n  // delegate iterator, or by modifying context.method and context.arg,\n  // setting context.delegate to null, and returning the ContinueSentinel.\n  function maybeInvokeDelegate(delegate, context) {\n    var method = delegate.iterator[context.method];\n    if (method === undefined) {\n      // A .throw or .return when the delegate iterator has no .throw\n      // method always terminates the yield* loop.\n      context.delegate = null;\n\n      if (context.method === \"throw\") {\n        // Note: [\"return\"] must be used for ES3 parsing compatibility.\n        if (delegate.iterator[\"return\"]) {\n          // If the delegate iterator has a return method, give it a\n          // chance to clean up.\n          context.method = \"return\";\n          context.arg = undefined;\n          maybeInvokeDelegate(delegate, context);\n\n          if (context.method === \"throw\") {\n            // If maybeInvokeDelegate(context) changed context.method from\n            // \"return\" to \"throw\", let that override the TypeError below.\n            return ContinueSentinel;\n          }\n        }\n\n        context.method = \"throw\";\n        context.arg = new TypeError(\n          \"The iterator does not provide a 'throw' method\");\n      }\n\n      return ContinueSentinel;\n    }\n\n    var record = tryCatch(method, delegate.iterator, context.arg);\n\n    if (record.type === \"throw\") {\n      context.method = \"throw\";\n      context.arg = record.arg;\n      context.delegate = null;\n      return ContinueSentinel;\n    }\n\n    var info = record.arg;\n\n    if (! info) {\n      context.method = \"throw\";\n      context.arg = new TypeError(\"iterator result is not an object\");\n      context.delegate = null;\n      return ContinueSentinel;\n    }\n\n    if (info.done) {\n      // Assign the result of the finished delegate to the temporary\n      // variable specified by delegate.resultName (see delegateYield).\n      context[delegate.resultName] = info.value;\n\n      // Resume execution at the desired location (see delegateYield).\n      context.next = delegate.nextLoc;\n\n      // If context.method was \"throw\" but the delegate handled the\n      // exception, let the outer generator proceed normally. If\n      // context.method was \"next\", forget context.arg since it has been\n      // \"consumed\" by the delegate iterator. If context.method was\n      // \"return\", allow the original .return call to continue in the\n      // outer generator.\n      if (context.method !== \"return\") {\n        context.method = \"next\";\n        context.arg = undefined;\n      }\n\n    } else {\n      // Re-yield the result returned by the delegate method.\n      return info;\n    }\n\n    // The delegate iterator is finished, so forget it and continue with\n    // the outer generator.\n    context.delegate = null;\n    return ContinueSentinel;\n  }\n\n  // Define Generator.prototype.{next,throw,return} in terms of the\n  // unified ._invoke helper method.\n  defineIteratorMethods(Gp);\n\n  Gp[toStringTagSymbol] = \"Generator\";\n\n  // A Generator should always return itself as the iterator object when the\n  // @@iterator function is called on it. Some browsers' implementations of the\n  // iterator prototype chain incorrectly implement this, causing the Generator\n  // object to not be returned from this call. This ensures that doesn't happen.\n  // See https://github.com/facebook/regenerator/issues/274 for more details.\n  Gp[iteratorSymbol] = function() {\n    return this;\n  };\n\n  Gp.toString = function() {\n    return \"[object Generator]\";\n  };\n\n  function pushTryEntry(locs) {\n    var entry = { tryLoc: locs[0] };\n\n    if (1 in locs) {\n      entry.catchLoc = locs[1];\n    }\n\n    if (2 in locs) {\n      entry.finallyLoc = locs[2];\n      entry.afterLoc = locs[3];\n    }\n\n    this.tryEntries.push(entry);\n  }\n\n  function resetTryEntry(entry) {\n    var record = entry.completion || {};\n    record.type = \"normal\";\n    delete record.arg;\n    entry.completion = record;\n  }\n\n  function Context(tryLocsList) {\n    // The root entry object (effectively a try statement without a catch\n    // or a finally block) gives us a place to store values thrown from\n    // locations where there is no enclosing try statement.\n    this.tryEntries = [{ tryLoc: \"root\" }];\n    tryLocsList.forEach(pushTryEntry, this);\n    this.reset(true);\n  }\n\n  exports.keys = function(object) {\n    var keys = [];\n    for (var key in object) {\n      keys.push(key);\n    }\n    keys.reverse();\n\n    // Rather than returning an object with a next method, we keep\n    // things simple and return the next function itself.\n    return function next() {\n      while (keys.length) {\n        var key = keys.pop();\n        if (key in object) {\n          next.value = key;\n          next.done = false;\n          return next;\n        }\n      }\n\n      // To avoid creating an additional object, we just hang the .value\n      // and .done properties off the next function object itself. This\n      // also ensures that the minifier will not anonymize the function.\n      next.done = true;\n      return next;\n    };\n  };\n\n  function values(iterable) {\n    if (iterable) {\n      var iteratorMethod = iterable[iteratorSymbol];\n      if (iteratorMethod) {\n        return iteratorMethod.call(iterable);\n      }\n\n      if (typeof iterable.next === \"function\") {\n        return iterable;\n      }\n\n      if (!isNaN(iterable.length)) {\n        var i = -1, next = function next() {\n          while (++i < iterable.length) {\n            if (hasOwn.call(iterable, i)) {\n              next.value = iterable[i];\n              next.done = false;\n              return next;\n            }\n          }\n\n          next.value = undefined;\n          next.done = true;\n\n          return next;\n        };\n\n        return next.next = next;\n      }\n    }\n\n    // Return an iterator with no values.\n    return { next: doneResult };\n  }\n  exports.values = values;\n\n  function doneResult() {\n    return { value: undefined, done: true };\n  }\n\n  Context.prototype = {\n    constructor: Context,\n\n    reset: function(skipTempReset) {\n      this.prev = 0;\n      this.next = 0;\n      // Resetting context._sent for legacy support of Babel's\n      // function.sent implementation.\n      this.sent = this._sent = undefined;\n      this.done = false;\n      this.delegate = null;\n\n      this.method = \"next\";\n      this.arg = undefined;\n\n      this.tryEntries.forEach(resetTryEntry);\n\n      if (!skipTempReset) {\n        for (var name in this) {\n          // Not sure about the optimal order of these conditions:\n          if (name.charAt(0) === \"t\" &&\n              hasOwn.call(this, name) &&\n              !isNaN(+name.slice(1))) {\n            this[name] = undefined;\n          }\n        }\n      }\n    },\n\n    stop: function() {\n      this.done = true;\n\n      var rootEntry = this.tryEntries[0];\n      var rootRecord = rootEntry.completion;\n      if (rootRecord.type === \"throw\") {\n        throw rootRecord.arg;\n      }\n\n      return this.rval;\n    },\n\n    dispatchException: function(exception) {\n      if (this.done) {\n        throw exception;\n      }\n\n      var context = this;\n      function handle(loc, caught) {\n        record.type = \"throw\";\n        record.arg = exception;\n        context.next = loc;\n\n        if (caught) {\n          // If the dispatched exception was caught by a catch block,\n          // then let that catch block handle the exception normally.\n          context.method = \"next\";\n          context.arg = undefined;\n        }\n\n        return !! caught;\n      }\n\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        var record = entry.completion;\n\n        if (entry.tryLoc === \"root\") {\n          // Exception thrown outside of any try block that could handle\n          // it, so set the completion value of the entire function to\n          // throw the exception.\n          return handle(\"end\");\n        }\n\n        if (entry.tryLoc <= this.prev) {\n          var hasCatch = hasOwn.call(entry, \"catchLoc\");\n          var hasFinally = hasOwn.call(entry, \"finallyLoc\");\n\n          if (hasCatch && hasFinally) {\n            if (this.prev < entry.catchLoc) {\n              return handle(entry.catchLoc, true);\n            } else if (this.prev < entry.finallyLoc) {\n              return handle(entry.finallyLoc);\n            }\n\n          } else if (hasCatch) {\n            if (this.prev < entry.catchLoc) {\n              return handle(entry.catchLoc, true);\n            }\n\n          } else if (hasFinally) {\n            if (this.prev < entry.finallyLoc) {\n              return handle(entry.finallyLoc);\n            }\n\n          } else {\n            throw new Error(\"try statement without catch or finally\");\n          }\n        }\n      }\n    },\n\n    abrupt: function(type, arg) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.tryLoc <= this.prev &&\n            hasOwn.call(entry, \"finallyLoc\") &&\n            this.prev < entry.finallyLoc) {\n          var finallyEntry = entry;\n          break;\n        }\n      }\n\n      if (finallyEntry &&\n          (type === \"break\" ||\n           type === \"continue\") &&\n          finallyEntry.tryLoc <= arg &&\n          arg <= finallyEntry.finallyLoc) {\n        // Ignore the finally entry if control is not jumping to a\n        // location outside the try/catch block.\n        finallyEntry = null;\n      }\n\n      var record = finallyEntry ? finallyEntry.completion : {};\n      record.type = type;\n      record.arg = arg;\n\n      if (finallyEntry) {\n        this.method = \"next\";\n        this.next = finallyEntry.finallyLoc;\n        return ContinueSentinel;\n      }\n\n      return this.complete(record);\n    },\n\n    complete: function(record, afterLoc) {\n      if (record.type === \"throw\") {\n        throw record.arg;\n      }\n\n      if (record.type === \"break\" ||\n          record.type === \"continue\") {\n        this.next = record.arg;\n      } else if (record.type === \"return\") {\n        this.rval = this.arg = record.arg;\n        this.method = \"return\";\n        this.next = \"end\";\n      } else if (record.type === \"normal\" && afterLoc) {\n        this.next = afterLoc;\n      }\n\n      return ContinueSentinel;\n    },\n\n    finish: function(finallyLoc) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.finallyLoc === finallyLoc) {\n          this.complete(entry.completion, entry.afterLoc);\n          resetTryEntry(entry);\n          return ContinueSentinel;\n        }\n      }\n    },\n\n    \"catch\": function(tryLoc) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.tryLoc === tryLoc) {\n          var record = entry.completion;\n          if (record.type === \"throw\") {\n            var thrown = record.arg;\n            resetTryEntry(entry);\n          }\n          return thrown;\n        }\n      }\n\n      // The context.catch method must only be called with a location\n      // argument that corresponds to a known catch block.\n      throw new Error(\"illegal catch attempt\");\n    },\n\n    delegateYield: function(iterable, resultName, nextLoc) {\n      this.delegate = {\n        iterator: values(iterable),\n        resultName: resultName,\n        nextLoc: nextLoc\n      };\n\n      if (this.method === \"next\") {\n        // Deliberately forget the last sent value so that we don't\n        // accidentally pass it on to the delegate.\n        this.arg = undefined;\n      }\n\n      return ContinueSentinel;\n    }\n  };\n\n  // Regardless of whether this script is executing as a CommonJS module\n  // or not, return the runtime object so that we can declare the variable\n  // regeneratorRuntime in the outer scope, which allows this module to be\n  // injected easily by `bin/regenerator --include-runtime script.js`.\n  return exports;\n\n}(\n  // If this script is executing as a CommonJS module, use module.exports\n  // as the regeneratorRuntime namespace. Otherwise create a new empty\n  // object. Either way, the resulting object will be used to initialize\n  // the regeneratorRuntime variable at the top of this file.\n   true ? module.exports : undefined\n));\n\ntry {\n  regeneratorRuntime = runtime;\n} catch (accidentalStrictMode) {\n  // This module should not be running in strict mode, so the above\n  // assignment should always work unless something is misconfigured. Just\n  // in case runtime.js accidentally runs in strict mode, we can escape\n  // strict mode using a global Function call. This could conceivably fail\n  // if a Content Security Policy forbids using Function, but in that case\n  // the proper solution is to fix the accidental strict mode problem. If\n  // you've misconfigured your bundler to force strict mode and applied a\n  // CSP to forbid Function, and you're not willing to fix either of those\n  // problems, please detail your unique predicament in a GitHub issue.\n  Function(\"r\", \"regeneratorRuntime = r\")(runtime);\n}\n\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
[31m-/***/ "./node_modules/@babel/runtime/regenerator/index.js":[m
[31m-/*!**********************************************************!*\[m
[31m-  !*** ./node_modules/@babel/runtime/regenerator/index.js ***![m
[31m-  \**********************************************************/[m
[31m-/*! no static exports found */[m
[31m-/***/ (function(module, exports, __webpack_require__) {[m
[31m-[m
[31m-eval("module.exports = __webpack_require__(/*! regenerator-runtime */ \"./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js\");\n\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/regenerator/index.js?");[m
[31m-[m
[31m-/***/ }),[m
[31m-[m
 /***/ "./node_modules/@emotion/cache/dist/cache.browser.esm.js":[m
 /*!***************************************************************!*\[m
   !*** ./node_modules/@emotion/cache/dist/cache.browser.esm.js ***![m
[36m@@ -917,7 +795,7 @@[m [meval("exports = module.exports = __webpack_require__(/*! ../../css-loader/dist/r[m
 /*! no static exports found */[m
 /***/ (function(module, exports, __webpack_require__) {[m
 [m
[31m-eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"\\n.Tittle {\\n    color: white;\\n    padding: 25px;\\n    font-family: Arial;\\n    text-align: center;\\n    font-size:40px;\\n    background:#687864;\\n}\\n\\nbody{\\n    background: #F2F2F2;\\n}\\n\\n.Center {\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    justify-content: center;\\n    width: 100%;\\n    padding: 50px;\\n}\\n\\n.Right {\\n    display: flex;\\n    justify-content: flex-end;\\n    padding-right: 10px;\\n    margin-bottom:-30px;\\n}\\n\\n.Nhap{\\n    font-size:28px;\\n    border:none;\\n}\\n\\n.Nhap:focus{\\n    border: 2px solid blue;\\n    width:1000px;\\n}\\n\\n\\n.ThayDoi{\\n    font-size:20px;\\n    border:none;\\n}\\n\\n.ThayDoi:focus{\\n    border: 2px solid blue;\\n}\\n\\n\\nbutton{\\n    padding: 10px 30px;\\n    border: none;\\n    border-radius: 30px;\\n    background-color: #31708E;\\n    color: #fff;\\n    font-size: 14px;\\n    cursor: pointer;\\n    font-weight:800;\\n}\\nbutton:hover {\\n    background: #40a9ff;\\n}\\n\\n#btnGet {\\n    margin-top: 30px;\\n}\\n\\n.SelectBox{\\n    background: #fff;\\n    color: #000;\\n    cursor: pointer;\\n    font-size:16px;\\n    font-weight:600;\\n    height:30px;\\n  \\n    /*for firefox*/\\n    -moz-appearance: none;\\n    /*for chrome*/\\n    -webkit-appearance:none;\\n    appearance: none;\\n    text-align:center;\\n    border: none;\\n    box-shadow: none;\\n}\\n\\n#dropDownPage {\\n    justify-content: right;\\n    margin-right: -8px;\\n}\\n\\n#dropDownLinhVuc{\\n    width: 400px;\\n}\\n\\nfooter{\\n    display: flex;\\n    background:#687864;\\n    color: #fff;\\n    margin-bottom:-20px;\\n    height: 60px;\\n    align-content: center;\\n    justify-content: center;\\n}\\n\\n.icon{ \\n    margin-left:10px;\\n    color:#31708E;\\n    font-size: 30px;\\n    cursor: pointer;\\n}\\n\\n.icon:hover{\\n    color: #40a9ff;\\n\\n}\\n\\n.iconLogOut{ \\n    position: absolute;\\n    right: 15px;\\n    top:5px;\\n    color:#40a9ff;\\n    font-size: 50px;\\n    cursor: pointer;\\n}\\n\\n.iconLogOut:hover{\\n    color:#fff;\\n}\\n\\n#LinhVucInput{\\n    visibility: hidden;\\n}\\n\\n#btnUpdate{\\n    visibility: hidden;\\n}\\n\\n.cung1hang{\\n    display: inline-grid;\\n    grid-template-columns: auto auto auto;\\n    margin-bottom: 20px;\\n    margin-left: 20px;\\n}\\n\\n.NoContact{\\n    color: #fff;\\n}\\n\\n.Contact{\\n    color:#000;\\n    background-color: #31708E;\\n}\\n.CustomSelectRow{\\n    font-weight: 800;\\n}\\n\\n.col-hidden{\\n    display: none;\\n}\\n\\n.form-horizontal{\\n    margin-top:30px;\\n}\", \"\"]);\n\n\n//# sourceURL=webpack:///./src/Style.css?./node_modules/css-loader/dist/cjs.js");[m
[32m+[m[32meval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"\\n.Tittle {\\n    color: white;\\n    padding: 25px;\\n    font-family: Arial;\\n    text-align: center;\\n    font-size:40px;\\n    background:#687864;\\n  }\\n  \\nbody{\\n    background: #F2F2F2;\\n}\\n\\n.Center {\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    justify-content: center;\\n    width: 100%;\\n    padding: 50px;\\n}\\n\\n.Right {\\n    display: flex;\\n    justify-content: flex-end;\\n    padding-right: 10px;\\n    margin-bottom:-30px;\\n}\\n\\n.Nhap{\\n    font-size:28px;\\n    border:none;\\n}\\n\\n.Nhap:focus{\\n    border: 2px solid blue;\\n    width:1000px;\\n}\\n\\n\\n.ThayDoi{\\n    font-size:20px;\\n    border:none;\\n}\\n\\n.ThayDoi:focus{\\n    border: 2px solid blue;\\n}\\n\\n\\nbutton{\\n    padding: 10px 30px;\\n    border: none;\\n    border-radius: 30px;\\n    background-color: #31708E;\\n    color: #fff;\\n    font-size: 14px;\\n    cursor: pointer;\\n    font-weight:800;\\n}\\nbutton:hover {\\n    background: #40a9ff;\\n}\\n\\n#btnGet {\\n    margin-top: 30px;\\n}\\n\\n.SelectBox{\\n    background: #fff;\\n    color: #000;\\n    cursor: pointer;\\n    font-size:16px;\\n    font-weight:600;\\n    height:30px;\\n  \\n    /*for firefox*/\\n    -moz-appearance: none;\\n    /*for chrome*/\\n    -webkit-appearance:none;\\n    appearance: none;\\n    text-align:center;\\n    border: none;\\n    box-shadow: none;\\n}\\n\\n#dropDownPage {\\n    justify-content: right;\\n    margin-right: -8px;\\n}\\n\\n#dropDownLinhVuc{\\n    width: 400px;\\n}\\n\\nfooter{\\n    display: flex;\\n    background:#687864;\\n    color: #fff;\\n    margin-bottom:-20px;\\n    height: 60px;\\n    align-content: center;\\n    justify-content: center;\\n}\\n\\n.icon{ \\n    margin-left:10px;\\n    color:#31708E;\\n    font-size: 30px;\\n    cursor: pointer;\\n}\\n\\n.icon:hover{\\n    color: #40a9ff;\\n\\n}\\n\\n#LinhVucInput{\\n    visibility: hidden;\\n}\\n\\n#btnUpdate{\\n    visibility: hidden;\\n}\\n\\n.cung1hang{\\n    display: inline-grid;\\n    grid-template-columns: auto auto auto;\\n    margin-bottom: 20px;\\n    margin-left: 20px;\\n}\\n\\n.NoContact{\\n    color: #fff;\\n}\\n\\n.Contact{\\n    color:#000;\\n    back