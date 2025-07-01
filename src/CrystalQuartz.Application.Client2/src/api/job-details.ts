import { PropertyValue } from './property-value';
import { JobProperties } from './job-properties';

export interface JobDetails {
  JobDataMap: PropertyValue | null;
  JobDetails: JobProperties | null;
}
