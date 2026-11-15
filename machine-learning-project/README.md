# StudentSense — Student Well-Being & Machine Learning

StudentSense is a student-focused web application and machine-learning project exploring the relationship between academic and lifestyle factors and student well-being. It brings together an interactive Next.js frontend, Python-based ML services, and a Jupyter notebook documenting the mental-health analysis workflow.

> **Important:** Model outputs are educational estimates, not a medical diagnosis or substitute for professional mental-health support.

## What’s in the project

- **Web application:** A Next.js and React interface for presenting student-focused content and interacting with the project’s ML features.
- **Mental-health analysis:** A notebook exploring student mental-health data and model development. A clustering API can group input profiles and return associated recommendations.
- **Risk estimation:** A Flask API that preprocesses student profile data and returns a model-based risk label, probabilities, comparisons with reference averages, and explanatory text.
- **CGPA prediction:** A FastAPI service for serving a saved scikit-learn prediction pipeline.

## Repository layout

```text
machine-learning-project/
├── Student_Mental_health_MLProject.ipynb  # Analysis and model exploration
├── app_clustering.py                      # Flask risk-estimation API
├── Recommendation_service/                # FastAPI recommendation/clustering service
├── predict_service/                       # FastAPI CGPA prediction service
├── src/                                   # Next.js application and ML assets
├── requirement.txt                        # Dependencies for the Flask service
└── package.json                           # Frontend scripts and dependencies
```

## Getting started

### Web application

Requirements: Node.js 18 or later and npm.

```bash
cd machine-learning-project
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. To create a production build, run `npm run build`.

### Flask risk-estimation API

The API uses the model assets under `src/app/ml_clustering_model`.

```bash
cd machine-learning-project
python -m venv .venv
# Activate the virtual environment, then:
pip install -r requirement.txt
python app_clustering.py
```

The API starts at [http://localhost:5000](http://localhost:5000). `GET /` is a health check, and `POST /predict` accepts a student profile and returns an estimate with supporting information.

### FastAPI services

The `Recommendation_service/` and `predict_service/` directories contain separate Python API services. Each has its own files and model assets; see the service-level documentation and requirements in those directories for service-specific setup and run instructions.

## Analysis notebook

Open `Student_Mental_health_MLProject.ipynb` in Jupyter Notebook, JupyterLab, or another compatible notebook environment to explore the analysis and modeling steps.

## Notes

- The ML endpoints require their corresponding serialized model and preprocessing assets to be present in the repository paths expected by each service.
- The frontend and APIs are separate components. Configure their API URLs appropriately when running them in different environments.
- Model predictions depend on the input data and the training process; they should not be used to make clinical decisions.

## License

No project-wide license is specified in this repository. Check with the maintainers before reusing or distributing the code or assets.
