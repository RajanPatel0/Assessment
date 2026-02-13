import mongoose from "mongoose";

const taskSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'in-progress', 'completed'],
        },
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

taskSchema.index({ createdBy: 1, createdAt: -1 });
taskSchema.index({ status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

//for updateat on same
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;