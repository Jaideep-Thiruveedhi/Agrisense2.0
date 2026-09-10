# Model Cards — honest labeling only

- `rules-only` is the serving artifact today. XGBoost/NumPyro training runs offline under `science/training/` with synthetic fixtures only for software tests.
- No fabricated dataset may claim field accuracy. Real labels must come from `journal.confirmed` + station observations before promotion.
- Calibration: quantile XGBoost per https://xgboost.readthedocs.io/en/latest/python/examples/prediction_intervals.html + conformal https://arxiv.org/abs/2107.07511
