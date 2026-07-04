include Makefile.env
-include Makefile.local.env
export

VERSION ?= $(shell node -p "require('./package.json').version")
IMAGE_REPOSITORY ?= $(REGISTRY_SERVER)/$(REGISTRY_NAMESPACE)/$(IMAGE_NAME)
IMAGE_TAG ?= $(VERSION)
IMAGE ?= $(IMAGE_REPOSITORY):$(IMAGE_TAG)

.PHONY: help install dev build-web check lint test validate-version verify-luban-ci build-image push-image login sync-version release bump-patch bump-minor bump-major print-version

help: ## Show this help message
	@echo "Available targets:"
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install Node dependencies
	npm install

dev: ## Start the Vite development server
	npm run dev

build-web: ## Build the frontend bundle
	npm run build

check: ## Run TypeScript checks
	npm run check

lint: ## Run ESLint
	npm run lint

test: ## Run unit tests
	npm test

print-version: ## Print the semantic version from package.json
	@echo $(VERSION)

validate-version: ## Validate that package.json contains a semantic version
	@printf '%s\n' "$(VERSION)" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$$' || \
		( echo "Error: VERSION must be semantic version major.minor.patch, got $(VERSION)" && exit 1 )

verify-luban-ci: ## Ensure luban-ci exists at LUBAN_CI_ROOT before syncing release config
	@if [ ! -d "$(LUBAN_CI_ROOT)" ]; then \
		echo "Warning: LUBAN_CI_ROOT not found at $(LUBAN_CI_ROOT)"; \
		echo "Please check out luban-ci to the expected location or override LUBAN_CI_ROOT before running release targets."; \
		exit 1; \
	fi
	@if [ ! -f "$(LUBAN_GATEWAY_CONFIG)" ]; then \
		echo "Warning: Expected gateway config not found at $(LUBAN_GATEWAY_CONFIG)"; \
		echo "Please verify LUBAN_CI_ROOT points to the correct luban-ci checkout before running release targets."; \
		exit 1; \
	fi

login: ## Login to the image registry using QUAY_USERNAME and QUAY_PASSWORD if provided
	@if [ -n "$(QUAY_USERNAME)" ] && [ -n "$(QUAY_PASSWORD)" ]; then \
		echo "$(QUAY_PASSWORD)" | docker login -u "$(QUAY_USERNAME)" --password-stdin $(REGISTRY_SERVER); \
	else \
		echo "QUAY_USERNAME/QUAY_PASSWORD not set; relying on existing docker credentials"; \
	fi

build-image: validate-version ## Build the container image tagged with the package semantic version
	@echo "Building $(IMAGE)"
	docker build --platform $(PLATFORM) -t $(IMAGE) .

push-image: validate-version ## Push the container image tagged with the package semantic version
	@echo "Pushing $(IMAGE)"
	@$(MAKE) build-image
	@$(MAKE) login
	docker push $(IMAGE)

sync-version: validate-version verify-luban-ci ## Sync gateway_image_name and gateway_image_tag in luban-ci to the current package version
	@echo "Syncing $(LUBAN_GATEWAY_CONFIG) to $(IMAGE_REPOSITORY):$(VERSION)"
	@node -e 'const fs=require("fs"); const path=process.argv[1]; const image=process.argv[2]; const version=process.argv[3]; let text=fs.readFileSync(path,"utf8"); text=text.replace(/gateway_image_name:\\s*\".*\"/, `gateway_image_name: "${image}"`); text=text.replace(/gateway_image_tag:\\s*\".*\"/, `gateway_image_tag: "${version}"`); fs.writeFileSync(path, text);' "$(LUBAN_GATEWAY_CONFIG)" "$(IMAGE_REPOSITORY)" "$(VERSION)"

release: validate-version ## Build, push, and sync luban-ci config for the current semantic version
	@$(MAKE) push-image
	@$(MAKE) sync-version

bump-patch: validate-version ## Bump package version to the next patch release and sync luban-ci config
	npm version patch --no-git-tag-version
	@$(MAKE) sync-version

bump-minor: validate-version ## Bump package version to the next minor release and sync luban-ci config
	npm version minor --no-git-tag-version
	@$(MAKE) sync-version

bump-major: validate-version ## Bump package version to the next major release and sync luban-ci config
	npm version major --no-git-tag-version
	@$(MAKE) sync-version
