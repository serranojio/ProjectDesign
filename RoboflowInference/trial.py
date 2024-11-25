from roboflow import Roboflow

rf = Roboflow(api_key="5yNSbYmPfQArT0CrClDY")
project = rf.workspace().project("pd-recent-dataset")
model = project.version(2).model

# infer on an image hosted elsewhere
print(model.predict("https://i.ytimg.com/vi/BM2DHIDl66U/maxresdefault.jpg").json())

# # save an image annotated with your predictions
# model.predict("https://i.ytimg.com/vi/BM2DHIDl66U/maxresdefault.jpg").save("prediction.jpg")
