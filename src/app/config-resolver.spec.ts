import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { configResolver } from './config-resolver';

describe('configResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => configResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
