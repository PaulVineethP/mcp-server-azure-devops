import { WorkItem } from '../types';
/**
 * Standard work item fixture for tests
 */
export declare const createWorkItemFixture: (
  id: number,
  title?: string,
  state?: string,
  assignedTo?: string,
) => WorkItem;
/**
 * Create a collection of work items for list tests
 */
export declare const createWorkItemsFixture: (count?: number) => WorkItem[];
