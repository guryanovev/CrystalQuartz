import { JobProperties } from './job-properties';
import { PropertyValue } from './property-value';

export interface JobDetails {
  JobDataMap: PropertyValue | null;
  JobDetails: JobProperties | null;
}
