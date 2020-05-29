PROJECT_NAME=uno

# ********** Local dependencies **********
clean:
	rm -rf node_modules

install_dependencies:
	npm install --no-audit


# ********** Generate env files **********
env/local:
	./create_env.sh .env.local

# ********** Docker **********

docker/build/test_image:
	docker build -t $(PROJECT_TEST_NAME) -f Dockerfile --no-cache .

docker/remove/test_image:
	docker rmi $(PROJECT_TEST_NAME)

docker/build:
	docker build -t $(DOCKER_HUB_NAMESPACE)/$(PROJECT_NAME) .

docker/build/%:
	docker build -t $(REPOSITORY)/$(PROJECT_NAME):$(VERSION) .

docker/run: docker/build
	docker run -ti --rm -p 8080:8080 $(REPOSITORY)/$(PROJECT_NAME)

# ********** Testes **********

test: docker/build/test_image
	docker run --rm $(PROJECT_TEST_NAME) make test_local

test_local:
	npm run lint
	npm run test:unit -- --coverage


# ********** Run **********

start_dev_server:
	npm run serve

build:install_dependencies
	npm run build
