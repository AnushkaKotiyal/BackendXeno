const Segment = require('../Models/Segmentaion');
const Customer = require("../Models/Customer");

// Create new segment
const createSegment = async (req, res) => {
  try {
    const { name, rules } = req.body;
 const userId = req.user.id; 
    if (!name || !rules || !rules.length) {
      return res.status(400).json({ error: "Segment name and rules are required" });
    }

    // Save segment to DB
    const segment = new Segment({ name, rules ,userId  });
    await segment.save();

    res.status(201).json({ message: "Segment created", segment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create segment" });
  }
};

// Get all segments
const getAllSegments = async (req, res) => {
  try {
     const userId = req.user.id; 
    const segments = await Segment.find({userId}).sort({ createdAt: -1 });
    res.status(200).json(segments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch segments" });
  }
};

// Get segment by id (optional, for detailed view)
const getSegmentById = async (req, res) => {
  try {
    const { id } = req.params;
     const userId = req.user.id; 
    const segment = await Segment.findOne({ _id: id, userId });
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    res.status(200).json(segment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch segment" });
  }
};

const buildMongoQuery = (ruleGroup) => {
  const mongoOperator = ruleGroup.operator === "AND" ? "$and" : "$or";
  const conditions = ruleGroup.conditions.map((cond) => {
    if (cond.conditions) {
      return buildMongoQuery(cond);
    } else {
      let op;
      switch (cond.operator) {
        case ">": op = "$gt"; break;
        case "<": op = "$lt"; break;
        case ">=": op = "$gte"; break;
        case "<=": op = "$lte"; break;
        case "=": op = "$eq"; break;
        case "!=": op = "$ne"; break;
        default: op = "$eq";
      }
      return { [cond.field]: { [op]: isNaN(cond.value) ? cond.value : Number(cond.value) } };
    }
  });

  return { [mongoOperator]: conditions };
};

const previewSegmentAudience = async (req, res) => {
  try {
    const { rules } = req.body;
    console.log(rules);

    if (!rules || !rules.length) {
      return res.status(400).json({ error: "Rules required for preview" });
    }

    // Wrap rules with a top-level group
    const mongoQuery = buildMongoQuery({
      operator: "AND",
      conditions: rules
    });
    mongoQuery.userId = req.user.id; 
    const audience = await Customer.find(mongoQuery);
    res.status(200).json({ audienceSize: audience.length, sampleAudience: audience.slice(0, 5) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to preview audience" });
  }
};


const deleteSegment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Segment.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Segment not found" });
    res.status(200).json({ message: "Segment deleted", segment: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete segment" });
  }
};

module.exports = {
  createSegment,
  getAllSegments,
  getSegmentById,
  previewSegmentAudience,
  deleteSegment,
  buildMongoQuery
};
