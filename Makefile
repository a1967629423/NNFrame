make:
	@echo "begin"
	tsc --build tsconfig.json
	@echo "done"
	@echo "begin run"
	node ./build/main.js